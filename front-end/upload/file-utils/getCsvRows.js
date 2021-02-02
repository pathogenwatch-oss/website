import { readAsText } from 'promise-file-reader';

import { parseCsvToJson } from '~/utils/Metadata';

const readCsvAsJson = file =>
  readAsText(file).then(parseCsvToJson)
;

const flattenCSVs = (files) =>
  files.reduce((memo, { data = {} }) => memo.concat(data), []);

export default csvFiles =>
  Promise.all(csvFiles.map(readCsvAsJson)).then(flattenCSVs);
