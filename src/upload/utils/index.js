import { readAsText } from 'promise-file-reader';

import MetadataUtils from '../../utils/Metadata';

import { validateGenomeSize, validateGenomeContent } from './validation';
import trimUserDefinedMetadata from '../../../universal/trimUserDefinedMetadata';

import { DEFAULT } from '../../app/constants';
import getCompressWorker from 'worker-loader?name=compress-worker.[hash].js!./compressWorker';

function parseMetadata(row) {
  if (!row) return undefined;

  const {
    displayname,
    id,
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
    name: (displayname || id || name || filename).slice(0, 256),
    year: year ? parseInt(year, 10) : null,
    month: month ? parseInt(month, 10) : null,
    day: day ? parseInt(day, 10) : null,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    pmid: pmid ? pmid.slice(0, 16) : null,
    userDefined: trimUserDefinedMetadata(userDefined),
  };
}

function flattenCSVs(files) {
  return files.reduce((memo, { data = {} }) => memo.concat(data), []);
}

const GENOME_FILE_NAME_REGEX = new RegExp(`(${DEFAULT.GENOME_FILE_EXTENSIONS.join('|')})$`, 'i');
const CSV_FILE_NAME_REGEX = /(.csv)$/i;

export function mapCSVsToGenomes(files, uploadedAt) {
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
      readAsText(file).then(contents => MetadataUtils.parseCsvToJson(contents))
    )
  ).then(parsedFiles => flattenCSVs(parsedFiles))
   .then(rows =>
      genomeFiles.map((file, index) => {
        const row = rows.find(({ filename }) => filename === file.name);
        return {
          id: `${file.name}__${Date.now()}_${index}`,
          name: file.name,
          file,
          uploadedAt,
          ...parseMetadata(row),
          owner: 'me',
          uploaded: true,
        };
      })
    );
}

export function compress(text) {
  return new Promise((resolve, reject) => {
    const worker = getCompressWorker();
    worker.onmessage = function (event) {
      resolve(event.data);
    };
    worker.onerror = reject;
    worker.postMessage(text);
  });
}

export function validate(genome) {
  return (
    validateGenomeSize(genome.file)
      .then(readAsText)
      .then(validateGenomeContent)
  );
}
