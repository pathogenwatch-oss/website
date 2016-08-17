import registerPromiseWorker from 'promise-worker/register';
import Papa from 'papaparse';

import { wgsaDataColumnProps, getUserDefinedValue } from '^/constants/metadata';
import { nameColumnData } from '^/constants/table/columns';

import { formatColumnLabel } from './index';

function mapKeysToGetters(columns) {
  return columns.reduce((memo, { columnKey, valueGetter }) => ({
    ...memo,
    [columnKey]: valueGetter,
  }), {});
}

const gettersByTable = {
  metadata: {
    ...mapKeysToGetters([
      nameColumnData,
      ...wgsaDataColumnProps,
    ]),
    __general: getUserDefinedValue,
  },
  resistanceProfile: {
    ...mapKeysToGetters([ nameColumnData ]),
    __general(antibiotic, { analysis = {} }) {
      if (!analysis.resistanceProfile) {
        return 0;
      }
      const value = analysis.resistanceProfile[antibiotic];
      return value === 'RESISTANT' ? 1 : 0;
    },
  },
};

function mapToGetters(columnKeys, table) {
  const getters = gettersByTable[table];
  return columnKeys.map(key => {
    if (key in getters) {
      return getters[key];
    }
    return (row) => getters.__general(key, row);
  });
}

registerPromiseWorker((message) => {
  const { table, columnKeys, rows } = message;
  const valueGetters = mapToGetters(columnKeys, table);

  return Papa.unparse({
    fields: columnKeys.map(_ => formatColumnLabel(_)),
    data: rows.map(row => valueGetters.map(getter => getter(row))),
  });
});
