import registerPromiseWorker from 'promise-worker/register';
import Papa from 'papaparse';

import { formatColumnKeyAsLabel } from './index';

import { systemDataColumns } from '../../collection-viewer/data-tables/constants';

import { getUserDefinedValue } from '../../collection-viewer/table/utils';
import { isResistant, hasElement } from '../../utils/resistanceProfile';

const nameColumnData = {
  columnKey: '__name',
  label: 'NAME',
  valueGetter({ name }) {
    return name;
  },
};

const definedColumns = {
  [nameColumnData.columnKey]: nameColumnData,
  ...systemDataColumns,
};

const csvOptions = {
  metadata: {
    valueGetter: getUserDefinedValue,
    formatLabel: true,
  },
  typing: {
    valueGetter: getUserDefinedValue,
    formatLabel: true,
  },
  stats: {
    valueGetter: getUserDefinedValue,
    formatLabel: true,
  },
  antibiotics: {
    valueGetter: (antibiotic, { analysis: { resistanceProfile } }) =>
      (isResistant(resistanceProfile, antibiotic) ? 1 : 0),
  },
  snps: {
    valueGetter: (snp, genome) => (hasElement(genome, 'snp', snp) ? 1 : 0),
  },
  genes: {
    valueGetter: (gene, genome) => (hasElement(genome, 'gene', gene) ? 1 : 0),
  },
};

function mapToGetters(columnKeys, table) {
  return columnKeys.map(key => {
    if (key in definedColumns) {
      return definedColumns[key].valueGetter;
    }
    const { valueGetter } = csvOptions[table];
    return row => valueGetter(key, row);
  });
}

function mapToLabel(key, table) {
  const { formatLabel } = csvOptions[table];
  if (formatLabel) return formatColumnKeyAsLabel(key);
  return key in definedColumns ? (definedColumns[key].label || key) : key;
}

registerPromiseWorker((message) => {
  const { table, columnKeys, rows } = message;
  const valueGetters = mapToGetters(columnKeys, table);

  return Papa.unparse({
    fields: columnKeys.map(key => mapToLabel(key, table)),
    data: rows.map(row => valueGetters.map(getter => getter(row))),
  });
});
