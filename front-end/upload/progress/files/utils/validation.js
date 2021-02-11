export function InvalidGenomeError(message) {
  this.message = message;
  this.isMarkdown = true;
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
      throw new InvalidGenomeError('First contig header not found');
    }
    if (!isSequenceData) {
      const invalidCharRegex = /[^ACGTURYKMSWBDHVN]/gi;
      const invalidChars = new Set();
      for (const match of line.matchAll(invalidCharRegex)) {
        invalidChars.add(`\`${match[0]}\``);
      }
      throw new InvalidGenomeError(`Invalid sequence character(s) at line ${i + 1}. Please replace the following character(s): ${Array.from(invalidChars).join(" ")}`);
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
