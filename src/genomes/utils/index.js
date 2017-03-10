import { readAsText } from 'promise-file-reader';

import { updateGenomeProgress } from '../uploads/actions';

import MetadataUtils from '../../utils/Metadata';
import { API_ROOT, postJson } from '../../utils/Api';

import { validateGenomeSize, validateGenomeContent } from './validation';

import { DEFAULT } from '../../app/constants';

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
    hasMetadata: true,
    name: displayname || name || filename,
    year: year ? parseInt(year, 10) : null,
    month: month ? parseInt(month, 10) : null,
    day: day ? parseInt(day, 10) : null,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    pmid: pmid || null,
    userDefined:
      Object.keys(userDefined)
        .reduce((memo, key) => {
          memo[key.replace('.', '')] = userDefined[key];
          return memo;
        }, {}),
  };
}

function flattenCSVs(files) {
  return files.reduce((memo, { data = {} }) => memo.concat(data), []);
}

const GENOME_FILE_NAME_REGEX = new RegExp(`(${DEFAULT.GENOME_FILE_EXTENSIONS.join('|')})$`, 'i');
const CSV_FILE_NAME_REGEX = /(.csv)$/i;

export function mapCSVsToGenomes(files) {
  const csvFiles = files.filter(({ name }) => CSV_FILE_NAME_REGEX.test(name));
  const genomeFiles = files.filter(({ name }) => GENOME_FILE_NAME_REGEX.test(name));

  if (genomeFiles.length === 0) {
    return Promise.reject({
      toast: {
        message: 'No files recognised, please ensure that your files have supported file extensions.',
      },
    });
  }

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
        dispatch(updateGenomeProgress(id, percentRounded));
        previousPercent = percentRounded;
      }
    }
  }, false);

  return xhr;
}

export function update(id, metadata) {
  return postJson(`/genome/${id}`, metadata);
}

function create({ file, id, uploadedAt }, dispatch) {
  return (
    validateGenomeSize(file).
      then(readAsText).
      then(validateGenomeContent).
      then(data =>
        $.ajax({
          type: 'PUT',
          url: `${API_ROOT}/genome?${$.param({ name: file.name, uploadedAt })}`,
          contentType: 'text/plain; charset=UTF-8',
          data,
          dataType: 'json',
          xhr: () => getCustomXHR(id, dispatch),
        })
      )
  );
}

export function upload(genome, dispatch) {
  const { id, file, hasMetadata, ...props } = genome;
  return create(genome, dispatch).
    then((result) =>
      (hasMetadata ?
        update(result.id, props).
          then(updateResult => ({ ...result, ...updateResult })) :
        result
      )
    );
}
