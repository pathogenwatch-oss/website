import { readAsText } from 'promise-file-reader';

import actions from '../actions';

import MetadataUtils from '../../utils/Metadata';
import { API_ROOT, postJson } from '../../utils/Api';

import { validateGenomeSize, validateGenomeContent } from './validation';

function parseMetadata(row) {
  if (!row) return undefined;

  const {
    displayname,
    name,
    filename,
    year,
    month,
    day,
    latitude,
    longitude,
    pmid,
    ...userDefined,
  } = row;

  return {
    metadata: true,
    name: displayname || name || filename,
    year: year ? parseInt(year, 10) : null,
    month: month ? parseInt(month, 10) : null,
    day: day ? parseInt(day, 10) : null,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    pmid: pmid || null,
    userDefined,
  };
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
          ...parseMetadata(row),
          owner: 'me',
          uploaded: true,
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

export function upload({ id, file, metadata, ...props }, dispatch) {
  return create(file, id, dispatch).
    then((result) =>
      (metadata ?
        update(result.id, props).
          then(updateResult => ({ ...result, ...updateResult })) :
        result
      )
    );
}
