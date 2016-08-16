import { toCSV } from './table';

import { tableKeys } from '../constants/table';
import { collectionPath, encode } from '../constants/downloads';


export function generateMetadataFile({ tables, assemblies, assemblyIds }) {
  const rows = assemblyIds.map(id => assemblies[id]);

  // Removes downloads column
  const columns =
    tables[tableKeys.metadata].columns.slice(1);

  return new Promise((resolve) => resolve(toCSV(columns, rows)));
}

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

export function createBlobLink(type = 'text/plain;charset=utf-8', data) {
  const blob = new Blob([ data ], { type });
  return windowURL.createObjectURL(blob);
}
