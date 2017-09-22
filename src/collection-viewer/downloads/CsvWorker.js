import registerPromiseWorker from 'promise-worker/register';
import Papa from 'papaparse';

import { getUserDefinedValue } from '../table/utils';

import { systemDataColumns } from '../data-tables/constants';

import { isResistant, hasElement } from '../amr-utils';

const nameColumn = {
  columnKey: '__name',
  valueGetter({ name }) {
    return name;
  },
};

const latitudeColumn = {
  columnKey: '__latitude',
  valueGetter({ position }) {
    return position && position.latitude ? position.latitude : '';
  },
};

const longitudeColumn = {
  columnKey: '__longitude',
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

const valueGettersByTable = {
  metadata: getUserDefinedValue,
  typing: getUserDefinedValue,
  stats: getUserDefinedValue,
  antibiotics: (antibiotic, { analysis: { paarsnp } }) =>
      (isResistant(paarsnp, antibiotic) ? 1 : 0),
  snps: (snp, genome) => (hasElement(genome, 'snp', snp) ? 1 : 0),
  genes: (gene, genome) => (hasElement(genome, 'paar', gene) ? 1 : 0),
};

function mapToGetters(columns, table) {
  return columns.map(({ key }) => {
    if (key in definedColumns) {
      return definedColumns[key].valueGetter;
    }
    const valueGetter = valueGettersByTable[table];
    return row => valueGetter(key, row);
  });
}

registerPromiseWorker((message) => {
  const { table, columns, rows } = message;
  const valueGetters = mapToGetters(columns, table);
  return Papa.unparse({
    fields: columns.map(_ => _.label),
    data: rows.map(row => valueGetters.map(getter => getter(row))),
  });
});
