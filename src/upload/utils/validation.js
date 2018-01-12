import config from '../../app/config';

export function InvalidGenomeError(message) {
  this.message = message;
}

const MAX_GENOME_FILE_SIZE = config.maxGenomeFileSize * 1048576;

export function validateGenomeSize(file) {
  return new Promise((resolve, reject) => {
    if (file.size === 0) {
      reject(new InvalidGenomeError('This is an empty file.'));
    } else if (file.size > MAX_GENOME_FILE_SIZE) {
      reject(new InvalidGenomeError(`This file is larger than ${config.maxGenomeFileSize} MB.`));
    } else {
      resolve(file);
    }
  });
}

const sequenceDataRegex = /^[ACGTURYKMSWBDHVN]+$/i;
const ignoreLineRegex = /^>|^;/;

export function validateGenomeContent(genomeContent) {
  const cleanContent = genomeContent.replace(/\r/g, '');
  const lines = cleanContent.split('\n');
  let firstContigFound = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) continue;
    if (!firstContigFound && line[0] === '>') {
      firstContigFound = true;
      continue;
    }
    if (ignoreLineRegex.test(line)) continue;
    const isSequenceData = sequenceDataRegex.test(line);
    if (!firstContigFound && isSequenceData) {
      throw new InvalidGenomeError('First contig header not found.');
    }
    if (!isSequenceData) {
      throw new InvalidGenomeError(`Invalid sequence data at line ${i + 1}.`);
    }
  }
  return cleanContent;
}

export function isInvalidUpload({ error }) {
  return error && error instanceof InvalidGenomeError;
}

export function isFailedUpload({ error }) {
  return error && !(error instanceof InvalidGenomeError);
}
