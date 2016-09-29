import PromiseWorker from 'promise-worker';

import { tableKeys } from '../constants/table';
import { collectionPath, encode } from '../constants/downloads';

import getCSVWorker from 'worker?name=csv.worker.js!./table/CsvWorker';

function convertTableToCSV(table, dataType) {
  return function ({ tables, assemblies, assemblyIds }) {
    const columnKeys =
      tables[table].columns.
        filter(_ => 'valueGetter' in _).
        map(_ => _.columnKey);

    const rows = assemblyIds.map(_ => assemblies[_]);

    return (
      new PromiseWorker(getCSVWorker()).
        postMessage({ table, dataType, rows, columnKeys })
    );
  };
}

const { metadata, resistanceProfile } = tableKeys;
export const generateMetadataFile = convertTableToCSV(metadata);
export const generateAMRProfile =
  convertTableToCSV(resistanceProfile, 'profile');
export const generateAMRMechanisms =
  convertTableToCSV(resistanceProfile, 'mechanisms');

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
