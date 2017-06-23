import registerPromiseWorker from 'promise-worker/register';
import Papa from 'papaparse';

import { getUserDefinedValue } from '../table/utils';

import { systemDataColumns } from '../data-tables/constants';

import { isResistant, hasElement } from '../amr-utils';

const nameColumn = {
  columnKey: '__name',
  label: 'NAME',
  valueGetter({ name }) {
    return name;
  },
};

const latitudeColumn = {
  columnKey: '__latitude',
  label: 'LATITUDE',
  valueGetter({ position }) {
    return position && position.latitude ? position.latitude : '';
  },
};

const longitudeColumn = {
  columnKey: '__longitude',
  label: 'LONGITUDE',
  valueGetter({ position }) {
    return position && position.longitude ? position.longitude : '';
  },
};

const definedColumns = {
  [nameColumn.columnKey]: nameColumn,
  [latitudeColumn.columnKey]: latitudeColumn,
  [longitudeColumn.columnKey]: longitudeColumn,
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
    valueGetter: (antibiotic, { analysis: { paarsnp } }) =>
      (isResistant(paarsnp, antibiotic) ? 1 : 0),
  },
  snps: {
    valueGetter: (snp, genome) => (hasElement(genome, 'snp', snp) ? 1 : 0),
  },
  genes: {
    valueGetter: (gene, genome) => (hasElement(genome, 'paar', gene) ? 1 : 0),
  },
};

function mapToGetters(columns, table) {
  return columns.map(({ key }) => {
    if (key in definedColumns) {
      return definedColumns[key].valueGetter;
    }
    const { valueGetter } = csvOptions[table];
    return row => valueGetter(key, row);
  });
}

function getLabel({ key, label }) {
  if (key in definedColumns) {
    return definedColumns[key].label || label;
  }
  return label;
}

registerPromiseWorker((message) => {
  const { table, columns, rows } = message;
  const valueGetters = mapToGetters(columns, table);

  return Papa.unparse({
    fields: columns.map(getLabel),
    data: rows.map(row => valueGetters.map(getter => getter(row))),
  });
});
