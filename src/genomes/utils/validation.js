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
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0 || ignoreLineRegex.test(line)) continue;
    if (!sequenceDataRegex.test(line)) {
      throw new InvalidGenomeError(`Invalid sequence data at line ${i + 1}`);
    }
  }
  return cleanContent;
}

export function isFailedUpload({ error }) {
  return error && !error instanceof InvalidGenomeError;
}
