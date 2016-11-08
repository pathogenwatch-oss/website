import registerPromiseWorker from 'promise-worker/register';
import Papa from 'papaparse';

import { formatColumnKeyAsLabel } from './index';

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
  resistanceProfile(dataType) {
    return {
      ...mapKeysToGetters([ nameColumnData ]),
      __general(antibiotic, { analysis: { resistanceProfile } = {} }) {
        switch (dataType) {
          case 'profile':
            if (!resistanceProfile) {
              return 0;
            }
            return isResistant(resistanceProfile, antibiotic) ? 1 : 0;
          case 'mechanisms':
            if (!resistanceProfile) {
              return '""';
            }
            return `"${resistanceProfile[antibiotic].mechanisms.join(',')}"`;
          default:
            return '';
        }
      },
    };
  },
};

function mapToGetters(columnKeys, table, dataType) {
  const getters = gettersByTable[table](dataType);
  return columnKeys.map(key => {
    if (key in getters) {
      return getters[key];
    }
    return (row) => getters.__general(key, row);
  });
}

registerPromiseWorker((message) => {
  const { table, dataType, columnKeys, rows } = message;
  const valueGetters = mapToGetters(columnKeys, table, dataType);

  return Papa.unparse({
    fields: columnKeys.map(key => formatColumnKeyAsLabel(key)),
    data: rows.map(row => valueGetters.map(getter => getter(row))),
  });
});
