import { parseMetadata } from '~/utils/Metadata';
import { isReadsEligible } from '../file-utils';
import pairReadsFiles from './pairReadsFiles';
import getCsvRows from './getCsvRows';

import { fileTypes } from '../constants';
import { ASSEMBLY_FILE_EXTENSIONS } from '~/app/constants';

import { CSV_FILENAME_REGEX } from '~/utils/Metadata';
const READS_FILENAME_REGEX = /^(.*)[_\.]R?[12]\.fastq\.gz$/;
const ASSEMBLY_FILENAME_REGEX = new RegExp(
  `(${ASSEMBLY_FILE_EXTENSIONS.join('|')})$`,
  'i'
);

import config from '~/app/config';
const { maxGenomeFileSize = 20 } = config;
const MAX_ASSEMBLY_FILE_SIZE = maxGenomeFileSize * 1048576;

function validateAssemblySize(file) {
  if (file.size === 0) {
    throw new Error(`${file.name} is an empty file.`);
  } else if (file.size > MAX_ASSEMBLY_FILE_SIZE) {
    throw new Error(
      `${file.name} is too large, the limit is ${maxGenomeFileSize} MB.`
    );
  } else {
    return file;
  }
}

export default function (files, assemblerUsage) {
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

  let readsPairs = {};
  try {
    readsPairs = pairReadsFiles(reads, READS_FILENAME_REGEX, assemblerUsage);
  } catch (e) {
    return Promise.reject(e);
  }

  return getCsvRows(csvFiles)
    .then(rows => [
      ...assemblies.map((file, index) => {
        const name = file.name.replace(ASSEMBLY_FILENAME_REGEX, '');
        const row = rows.find(r => r.filename === file.name || r.filename === name);
        return {
          files: [ file ],
          id: `${file.name}__${Date.now()}_${index}`,
          metadata: row ? parseMetadata(row, name) : null,
          name,
          type: fileTypes.ASSEMBLY,
        };
      }),
      ...Object.entries(readsPairs).map(([ id, filesByName ], index) => {
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
    ]);
}
