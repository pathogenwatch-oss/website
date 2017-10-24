const fs = require('fs');

const sequenceDataRegex = /^[ACGTURYKMSWBDHVN]+$/i;
const ignoreLineRegex = /^>|^;/;

function validateGenomeContent(genomeContent) {
  const cleanContent = genomeContent.replace(/\r/g, '');
  const lines = cleanContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0 || ignoreLineRegex.test(line)) continue;
    if (!sequenceDataRegex.test(line)) {
      console.error('Invalid sequence data at line', i);
      // throw genomeValidationErrors.INVALID_GENOME_CONTENT;
    }
  }
  return cleanContent;
}

const dir = process.argv[2];
const files = fs.readdirSync(dir);
// const files = [ dir ];

process.chdir(dir);

for (const file of files) {
  console.log('-----', file, '-----');
  if (!/\.fa(sta)?$/.test(file)) {
    console.warn('Wrong file extension, skipping');
    continue;
  }

  const content = fs.readFileSync(file, 'UTF-8');
  validateGenomeContent(content, file);
}
