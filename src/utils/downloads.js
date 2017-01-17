import PromiseWorker from 'promise-worker';

import { getTables } from '../collection-viewer/table/selectors';

import { tableKeys } from '../collection-viewer/table/constants';
import { collectionPath, encode } from '../constants/downloads';

import getCSVWorker from 'worker?name=csv.worker.js!../table/utils/CsvWorker';

function ungroup(column) {
  if (column.hidden) return [];
  if (!column.group) return column;
  return column.columns.reduce((columns, c) => columns.concat(ungroup(c)), []);
}

function convertTableToCSV(table) {
  return function (state) {
    const { assemblies, assemblyIds } = state;
    const columnKeys =
      getTables(state)[table].columns.
        reduce((flat, column) => flat.concat(ungroup(column)), []).
        filter(_ => 'valueGetter' in _).
        map(_ => _.columnKey);

    const rows = assemblyIds.map(id => assemblies[id]);

    return (
      new PromiseWorker(getCSVWorker()).postMessage({
        table,
        rows,
        columnKeys: Array.from(new Set(columnKeys)), // quick hack for unique columns
      })
    );
  };
}

export const generateMetadataFile = convertTableToCSV(tableKeys.metadata);
export const generateTypingFile = convertTableToCSV(tableKeys.typing);
export const generateStatsFile = convertTableToCSV(tableKeys.stats);
export const generateAMRProfile = convertTableToCSV(tableKeys.antibiotics);
export const generateAMRSNPs = convertTableToCSV(tableKeys.snps);
export const generateAMRGenes = convertTableToCSV(tableKeys.genes);

export function createDefaultLink(keyMap, filename) {
  const key = Object.keys(keyMap)[0];

  if (!key) {
    return null;
  }

  return (
    `${collectionPath()}/${encode(key)}?prettyFileName=${encode(filename)}`
  );
}

const windowURL = window.URL || window.webkitURL;

export function createCSVLink(data) {
  const blob = new Blob([ data ], { type: 'text/csv;charset=utf-8' });
  return windowURL.createObjectURL(blob);
}
