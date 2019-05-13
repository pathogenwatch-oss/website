export function InvalidGenomeError(message) {
  this.message = message;
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
