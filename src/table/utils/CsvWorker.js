import registerPromiseWorker from 'promise-worker/register';
import Papa from 'papaparse';

import { formatColumnKeyAsLabel } from './index';

import { systemDataColumns, getUserDefinedValue } from '^/constants/metadata';

import { isResistant } from '^/utils/resistanceProfile';

import { nameColumnData } from '^/constants/table/columns';

const columnDefsByTable = {
  metadata() {
    return {
      defined: {
        [nameColumnData.columnKey]: nameColumnData,
        ...systemDataColumns,
      },
      genericGetter: getUserDefinedValue,
    };
  },
  resistanceProfile(dataType) {
    return {
      defined: {
        [nameColumnData.columnKey]: nameColumnData,
      },
      genericGetter: (antibiotic, { analysis: { resistanceProfile } }) => {
        switch (dataType) {
          case 'profile':
            return isResistant(resistanceProfile, antibiotic) ? 1 : 0;
          case 'mechanisms': {
            const { antibiotics } = resistanceProfile;
            return `"${antibiotics[antibiotic].mechanisms.join(',')}"`;
          }
          default:
            return '';
        }
      },
    };
  },
};

function mapToGetters({ columnKeys, table, dataType }) {
  const columns = columnDefsByTable[table](dataType);
  return columnKeys.map(key => {
    if (key in columns.defined) {
      return columns.defined[key].valueGetter;
    }
    return row => columns.genericGetter(key, row);
  });
}

registerPromiseWorker((message) => {
  const { table, dataType, columnKeys, rows } = message;
  const valueGetters = mapToGetters({ columnKeys, table, dataType });

  return Papa.unparse({
    fields: columnKeys.map(key => formatColumnKeyAsLabel(key)),
    data: rows.map(row => valueGetters.map(getter => getter(row))),
  });
});
