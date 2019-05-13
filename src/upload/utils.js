import { readAsText } from 'promise-file-reader';

import MetadataUtils from '~/utils/Metadata';

import validateMetadata from '~/../universal/validateMetadata.js';

import { fileTypes } from './constants';
import { ASSEMBLY_FILE_EXTENSIONS } from '~/app/constants';

import config from '~/app/config';

export function isReadsEligible() {
  return 'assemblerAddress' in config;
}

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

const READS_FILENAME_REGEX = /^(.*)[_\.]R?[12]\.fastq\.gz$/;
const ASSEMBLY_FILENAME_REGEX = new RegExp(
  `(${ASSEMBLY_FILE_EXTENSIONS.join('|')})$`,
  'i'
);
export const CSV_FILENAME_REGEX = /(\.csv)$/i;

function pairReadsFiles(files, assemblerUsage = {}) {
  const pairs = {};
  const maxSizeMB = assemblerUsage.maxSize || 500;
  const maxSize = maxSizeMB * 1048576;
  for (const file of files) {
    if (file.size > maxSize) {
      throw new Error(
        `${file.name} is too large, the limit is ${maxSizeMB} MB.`
      );
    }
    if (file.type !== 'application/gzip' || file.type !== 'text/gzip') {
      throw new Error(
        `${file.name} is not in the correct format, reads must be gzipped.`
      );
    }
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
  if (assemblerUsage && Object.keys(pairs).length > assemblerUsage.remaining) {
    throw new Error(
      'You do not have enough remaining assemblies to complete this upload.'
    );
  }
  return pairs;
}

const MAX_ASSEMBLY_FILE_SIZE = config.maxGenomeFileSize * 1048576;

function validateAssemblySize(file) {
  if (file.size === 0) {
    throw new Error(`${file.name} is an empty file.`);
  } else if (file.size > MAX_ASSEMBLY_FILE_SIZE) {
    throw new Error(
      `${file.name} is too large, the limit is ${config.maxGenomeFileSize} MB.`
    );
  } else {
    return file;
  }
}

export function mapCSVsToGenomes(files, assemblerUsage) {
  const csvFiles = [];
  const assemblies = [];
  const reads = [];
  const readsElligible = isReadsEligible();
  for (const file of files) {
    if (CSV_FILENAME_REGEX.test(file.name)) {
      csvFiles.push(file);
      continue;
    } else if (ASSEMBLY_FILENAME_REGEX.test(file.name)) {
      try {
        validateAssemblySize(file);
      } catch (e) {
        return Promise.reject(e);
      }
      assemblies.push(file);
      continue;
    } else if (readsElligible && READS_FILENAME_REGEX.test(file.name)) {
      reads.push(file);
      continue;
    }
  }

  if (assemblies.length === 0 && reads.length <= 1) {
    return Promise.reject({
      message:
        'Please ensure that your files include at least one genome with the supported file extensions.',
    });
  }

  let pairedReads = {};
  try {
    pairedReads = pairReadsFiles(reads, assemblerUsage);
  } catch (e) {
    return Promise.reject({
      message: e.message,
    });
  }

  return Promise.all(
    csvFiles.map(file =>
      readAsText(file).then(contents => MetadataUtils.parseCsvToJson(contents))
    )
  )
    .then(parsedFiles => flattenCSVs(parsedFiles))
    .then(rows => [
      ...Object.entries(pairedReads).map(([ id, filesByName ], index) => {
        const fileNames = Object.keys(filesByName);
        const row = rows.find(
          r => r.filename === id || fileNames.includes(r.filename)
        );
        return {
          files: Object.values(filesByName),
          id: `${id}__${Date.now()}_${index}`,
          metadata: row ? parseMetadata(row) : null,
          name: id,
          type: fileTypes.READS,
        };
      }),
      ...assemblies.map((file, index) => {
        const row = rows.find(r => r.filename === file.name);
        return {
          files: [ file ],
          id: `${file.name}__${Date.now()}_${index}`,
          metadata: row ? parseMetadata(row) : null,
          name: file.name,
          type: fileTypes.ASSEMBLY,
        };
      }),
    ]);
}
