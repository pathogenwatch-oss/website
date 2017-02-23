import PromiseWorker from 'promise-worker';

import getCSVWorker from 'worker?name=csv.worker.js!./CsvWorker';

import { tableKeys } from '../constants';

function ungroup(column) {
  if (column.hidden) return [];
  if (!column.group) return column;
  return column.columns.reduce((columns, c) => columns.concat(ungroup(c)), []);
}

function convertTableToCSV(table) {
  return function (state) {
    const { genomes, genomeIds, tables } = state;
    const columnKeys =
      tables[table].columns.
        reduce((flat, column) => flat.concat(ungroup(column)), []).
        filter(_ => 'valueGetter' in _).
        map(_ => _.columnKey);

    const rows = genomeIds.map(id => genomes[id]);

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

const windowURL = window.URL || window.webkitURL;

export function createCSVLink(data) {
  const blob = new Blob([ data ], { type: 'text/csv;charset=utf-8' });
  return windowURL.createObjectURL(blob);
}
