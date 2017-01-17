import registerPromiseWorker from 'promise-worker/register';
import Papa from 'papaparse';

import { formatColumnKeyAsLabel } from './index';

import { systemDataColumns, getUserDefinedValue }
  from '../../collection-viewer/data-tables/constants';

import { isResistant } from '../../utils/resistanceProfile';

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
    valueGetter: (snp, { analysis: { resistanceProfile } }) =>
      (resistanceProfile.snp.indexOf(snp) === -1 ? 0 : 1),
  },
  genes: {
    valueGetter: (gene, { analysis: { resistanceProfile } }) =>
      (resistanceProfile.paar.indexOf(gene) === -1 ? 0 : 1),
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
