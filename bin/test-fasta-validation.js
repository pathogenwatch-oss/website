const fs = require('fs');

const regexp = /^([^\n]+\n)(?:[ACGTURYKMSWBDHVN]+\n)+$/i;

function validateGenomeContent(genomeContent, filename) {
  const cleanContent = genomeContent.replace(/\r/g, '');
  const contigs = cleanContent.split(/>/);
  for (let i = 0; i < contigs.length; i++) {
    const contig = contigs[i];
    const valid = regexp.test(contig.replace(/\n+$/, '\n'));
    console.log(
      `Contig ${i + 1} (${filename}):`, valid ? '✅ Passed.' : '😢 failed.'
    );
    // if (!valid) {
    //   console.dir(contig);
    // }
  }
}

const dir = process.argv[2];
const files = fs.readdirSync(dir);

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
