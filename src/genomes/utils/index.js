import { readAsText } from 'promise-file-reader';

import { updateGenomeProgress } from '../uploads/actions';

import MetadataUtils from '../../utils/Metadata';
import { fetchJson, fetchBinary } from '../../utils/Api';

import { validateGenomeSize, validateGenomeContent } from './validation';

import { DEFAULT } from '../../app/constants';
import getCompressWorker from 'worker?name=compress.worker.js!./compressWorker';

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
        message: 'Could not process these files. Please ensure that your files include at least one genome and have supported file extensions.',
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

export function update(id, metadata) {
  return fetchJson('POST', `/api/genome/${id}`, metadata);
}

function compressContent(text) {
  return new Promise((resolve, reject) => {
    const worker = getCompressWorker();
    worker.onmessage = function (event) {
      resolve(event.data);
    };
    worker.onerror = reject;
    worker.postMessage(text);
  });
}

function create({ file, id, uploadedAt }, dispatch) {
  return (
    validateGenomeSize(file)
      .then(readAsText)
      .then(validateGenomeContent)
      .then(compressContent)
      .then(data =>
        fetchBinary(
          'PUT',
          `/api/genome?${$.param({ name: file.name, uploadedAt })}`,
          data,
          percent => dispatch(updateGenomeProgress(id, percent))
        )
      )
  );
}

export function upload(genome, dispatch) {
  const { hasMetadata, ...props } = genome;
  return create(genome, dispatch).
    then((result) =>
      (hasMetadata ?
        update(result.id, props).
          then(updateResult => ({ ...result, ...updateResult })) :
        result
      )
    );
}

export function shouldNotFetch({ prefilter, uploadedAt }) {
  return (prefilter === 'upload' && !uploadedAt);
}
