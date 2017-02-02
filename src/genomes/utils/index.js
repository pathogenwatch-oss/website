import { readAsText } from 'promise-file-reader';

import actions from '../actions';

import MetadataUtils from '../../utils/Metadata';
import { API_ROOT, postJson } from '../../utils/Api';

import { validateGenomeSize, validateGenomeContent } from './validation';

function parseMetadata(row, name) {
  if (!row) return undefined;

  return {
    ...row,
    name: row.displayname || row.filename || row.name || name,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
  };
}

function parseDate({ year, month, day } = {}) {
  return year ? new Date(year, parseInt(month || '1', 10) - 1, day || 1) : undefined;
}

function flattenCSVs(files) {
  return files.reduce((memo, { data = {} }) => memo.concat(data), []);
}

export const GENOME_FILE_EXTENSIONS = [
  '.fa', '.fas', '.fna', '.ffn', '.faa', '.frn', '.genome', '.contig',
];
const GENOME_FILE_NAME_REGEX = new RegExp(`(${GENOME_FILE_EXTENSIONS.join('|')})$`, 'i');
const CSV_FILE_NAME_REGEX = /(.csv)$/i;

export function mapCSVsToGenomes(files) {
  const csvFiles = files.filter(({ name }) => CSV_FILE_NAME_REGEX.test(name));
  const genomeFiles = files.filter(({ name }) => GENOME_FILE_NAME_REGEX.test(name));

  return Promise.all(
    csvFiles.map(file =>
      readAsText(file).
        then(contents => MetadataUtils.parseCsvToJson(contents))
    )
  ).then(parsedFiles => flattenCSVs(parsedFiles))
   .then(rows =>
      genomeFiles.map((file, index) => {
        const row = rows.filter(({ filename }) => filename === file.name)[0];
        return {
          id: `${file.name}__${Date.now()}_${index}`,
          name: file.name,
          file,
          metadata: parseMetadata(row, name),
          date: parseDate(row),
          owner: 'me',
        };
      })
    );
}

function getCustomXHR(id, dispatch) {
  const xhr = new window.XMLHttpRequest();

  let previousPercent = 0;

  xhr.upload.addEventListener('progress', evt => {
    if (evt.lengthComputable) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      const percentRounded =
        Math.floor(percentComplete / 10) * 10;

      if (percentRounded > previousPercent) {
        dispatch(actions.updateGenomeProgress(id, percentRounded));
        previousPercent = percentRounded;
      }
    }
  }, false);

  return xhr;
}

export function update(id, metadata) {
  return postJson(`/genome/${id}`, metadata);
}

function create(file, id, dispatch) {
  return (
    validateGenomeSize(file).
      then(readAsText).
      then(validateGenomeContent).
      then(data =>
        $.ajax({
          type: 'PUT',
          url: `${API_ROOT}/genome?name=${encodeURIComponent(file.name)}`,
          contentType: 'text/plain; charset=UTF-8',
          data,
          dataType: 'json',
          xhr: () => getCustomXHR(id, dispatch),
        })
      )
  );
}

export function upload({ id, file, metadata }, dispatch) {
  return create(file, id, dispatch).
    then((result) =>
      (metadata ?
        update(result.id, metadata).
          then(updateResult => ({ ...result, ...updateResult })) :
        result
      )
    );
}
