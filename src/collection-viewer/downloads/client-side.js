import PromiseWorker from 'promise-worker';

import { getTables } from '../table/selectors';
import { tableKeys } from '../table/constants';

import getCSVWorker from 'worker?name=csv.worker.js!./CsvWorker';

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

const { metadata, antibiotics, snps, genes } = tableKeys;
export const generateMetadataFile = convertTableToCSV(metadata);
export const generateAMRProfile = convertTableToCSV(antibiotics);
export const generateAMRSNPs = convertTableToCSV(snps);
export const generateAMRGenes = convertTableToCSV(genes);

const windowURL = window.URL || window.webkitURL;

export function createCSVLink(data) {
  const blob = new Blob([ data ], { type: 'text/csv;charset=utf-8' });
  return windowURL.createObjectURL(blob);
}
