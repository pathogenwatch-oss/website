import registerPromiseWorker from 'promise-worker/register';
import Papa from 'papaparse';

import { formatColumnKeyAsLabel } from '../table/utils';

import { systemDataColumns } from '../metadata-table/constants';
import { getUserDefinedValue } from '../metadata-table/utils';

import { isResistant } from '../amr-utils';

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
