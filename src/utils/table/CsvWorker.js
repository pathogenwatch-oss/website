import registerPromiseWorker from 'promise-worker/register';
import Papa from 'papaparse';

import { formatColumnLabel } from './index';

import {
  getSystemDataColumnProps,
  getUserDefinedValue,
} from '^/constants/metadata';

import { isResistant } from '^/utils/resistanceProfile';

import { nameColumnData } from '^/constants/table/columns';

import Species from '^/species';


function mapKeysToGetters(columns) {
  return columns.reduce((memo, { columnKey, valueGetter }) => ({
    ...memo,
    [columnKey]: valueGetter,
  }), {});
}

const gettersByTable = {
  metadata() {
    const { uiOptions = {} } = Species.current;
    return {
      ...mapKeysToGetters([
        nameColumnData,
        ...getSystemDataColumnProps(uiOptions),
      ]),
      __general: getUserDefinedValue,
    };
  },
  resistanceProfile() {
    return {
      ...mapKeysToGetters([ nameColumnData ]),
      __general(antibiotic, { analysis = {} }) {
        if (!analysis.resistanceProfile) {
          return 0;
        }
        return isResistant(analysis.resistanceProfile, antibiotic) ? 1 : 0;
      },
    };
  },
};

function mapToGetters(columnKeys, table) {
  const getters = gettersByTable[table]();
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
