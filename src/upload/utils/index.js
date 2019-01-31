import { readAsText } from 'promise-file-reader';

import MetadataUtils from '../../utils/Metadata';

import { validateGenomeSize, validateGenomeContent } from './validation';
import validateMetadata from '../../../universal/validateMetadata.js';

import { ASSEMBLY_FILE_EXTENSIONS } from '../../app/constants';
import getCompressWorker from 'worker-loader?name=compress-worker.[hash].js!./compressWorker';

export function parseMetadata(row) {
  const { displayname, id, name, filename, ...columns } = row;

  const genomeName = displayname || id || name || filename;

  const { year, month, day, latitude, longitude, pmid, ...rest } = columns;

  const userDefined = {};
  for (const [ key, value ] of Object.entries(rest)) {
    if (!value.length) continue;
    userDefined[key] = value;
  }

  const values = {
    name: genomeName,
    year: year ? parseInt(year, 10) : null,
    month: month ? parseInt(month, 10) : null,
    day: day ? parseInt(day, 10) : null,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    pmid: pmid || null,
    userDefined,
  };

  validateMetadata(values);

  return values;
}

function flattenCSVs(files) {
  return files.reduce((memo, { data = {} }) => memo.concat(data), []);
}

const READS_FILENAME_REGEX = /^(\w*)[_\.]R?[12]\.fastq\.gz$/;
const ASSEMBLY_FILENAME_REGEX = new RegExp(
  `(${ASSEMBLY_FILE_EXTENSIONS.join('|')})$`,
  'i'
);
export const CSV_FILENAME_REGEX = /(\.csv)$/i;

function pairReadsFiles(files) {
  const pairs = {};
  for (const file of files) {
    const id = file.name.match(READS_FILENAME_REGEX)[1];
    pairs[id] = pairs[id] || {};
    pairs[id][file.name] = file;
  }
  for (const [ id, pairedFiles ] of Object.entries(pairs)) {
    if (Object.keys(pairedFiles).length !== 2) {
      throw new Error(
        `No pair found for files starting ${id}, please check and try again.`
      );
    }
  }
  return pairs;
}

export function mapCSVsToGenomes(files, uploadedAt) {
  const csvFiles = [];
  const assemblies = [];
  const reads = [];
  for (const file of files) {
    if (CSV_FILENAME_REGEX.test(file.name)) {
      csvFiles.push(file);
      continue;
    } else if (ASSEMBLY_FILENAME_REGEX.test(file.name)) {
      assemblies.push(file);
      continue;
    } else if (READS_FILENAME_REGEX.test(file.name)) {
      reads.push(file);
      continue;
    }

    return Promise.reject({
      toast: {
        message: `${
          file.name
        } is not a recognised file. Please remove or amend this file and try again.`,
      },
    });
  }

  if (assemblies.length === 0 && reads.length <= 1) {
    return Promise.reject({
      toast: {
        message:
          'Could not process these files. Please ensure that your files include at least one genome with the supported file extensions.',
      },
    });
  }

  let pairedReads = {};
  try {
    pairedReads = pairReadsFiles(reads);
  } catch (e) {
    return Promise.reject({
      toast: {
        message: e.message,
      },
    });
  }

  return Promise.all(
    csvFiles.map(file =>
      readAsText(file).then(contents => MetadataUtils.parseCsvToJson(contents))
    )
  )
    .then(parsedFiles => flattenCSVs(parsedFiles))
    .then(rows => ({
      reads: Object.entries(pairedReads).map(([ id, filesByName ], index) => {
        const fileNames = Object.keys(filesByName);
        const row = rows.find(
          r => r.filename === id || fileNames.includes(r.filename)
        );
        return {
          id: `${id}__${Date.now()}_${index}`,
          name: id,
          files: Object.values(filesByName),
          uploadedAt,
          metadata: row ? parseMetadata(row) : null,
        };
      }),
      assemblies: assemblies.map((file, index) => {
        const row = rows.find(r => r.filename === file.name);
        return {
          id: `${file.name}__${Date.now()}_${index}`,
          name: file.name,
          file,
          uploadedAt,
          metadata: row ? parseMetadata(row) : null,
          owner: 'me',
          uploaded: true,
        };
      }),
    }));
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
  return validateGenomeSize(genome.file)
    .then(readAsText)
    .then(validateGenomeContent);
}
