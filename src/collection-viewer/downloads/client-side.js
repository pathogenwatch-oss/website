import PromiseWorker from 'promise-worker';

import { getTables } from '../table/selectors';

import { tableKeys } from '../table/constants';

import getCSVWorker from 'worker?name=csv.worker.js!../../table/utils/CsvWorker';

function convertTableToCSV(table, dataType) {
  return function (state) {
    const { assemblies, assemblyIds } = state;
    const columnKeys =
      getTables(state)[table].columns.
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

const windowURL = window.URL || window.webkitURL;

export function createCSVLink(data) {
  const blob = new Blob([ data ], { type: 'text/csv;charset=utf-8' });
  return windowURL.createObjectURL(blob);
}
