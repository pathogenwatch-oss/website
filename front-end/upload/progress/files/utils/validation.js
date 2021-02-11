export function InvalidGenomeError(message) {
  this.message = message;
}

const sequenceDataRegex = /^[ACGTURYKMSWBDHVN]+$/i;
const ignoreLineRegex = /^>|^;/;
const invalidCharRegex = /[^ACGTURYKMSWBDHVN]/i;

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
      throw new InvalidGenomeError('First contig header not found');
    }
    if (!isSequenceData) {
      const invalidChars = Array.from(new Set(line.match(invalidCharRegex))).map(character => `\`${character}\``).join(' ');
      throw new InvalidGenomeError(`Invalid sequence character(s) at line ${i + 1}. Please replace the following character(s): ${invalidChars}`);
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
