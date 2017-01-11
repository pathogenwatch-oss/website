const promisify = require('promisify-node');
const fs = promisify('fs');
const argv = require('named-argv');
const path = require('path');

const Species = require('data/species');
const Genome = require('data/genome');
const { request } = require('services');
const mongoConnection = require('utils/mongoConnection');

const {
  speciesId,
  csvFile,
  fastaDir,
} = argv.opts;

console.log({ speciesId, csvFile, fastaDir });

if (!speciesId || !csvFile || !fastaDir) {
  console.log('Missing arguments');
  process.exit(1);
}

function parseRows(file) {
  const lines = file.split(/\r?\n/g);
  console.log('Num lines:', lines.length - 1);

  const headers = lines[0].split(',').map(_ => _.toLowerCase());
  console.log('Headers:', headers);

  return lines.slice(1).
    filter(line => line.length > 0).
    map(line => {
      const values = line.split(',');
      return headers.reduce((memo, header, index) => {
        if (header === 'displayname') {
          memo.name = values[index];
        } else {
          memo[header] = values[index];
        }
        return memo;
      }, {});
    });
}

function createGenome(metadata) {
  const { filename, uuid } = metadata;
  const stream = fs.createReadStream(path.join(fastaDir, filename));
  return (
    request('genome', 'create', { stream, metadata, reference: true }).
      then(({ id }) =>
        request('genome', 'edit', { id, metadata }).
          then(() => request('genome', 'fetch-one', { id }))
      ).
      then(genome => ({ uuid, genome }))
  );
}

mongoConnection.connect().
  then(() => Genome.remove({ speciesId, reference: true })).
  then(() => Promise.all([
    Species.create({ taxId: speciesId }),
    fs.readFile(csvFile, 'utf8').
      then(parseRows).
      then(rows => rows.reduce((memo, row) =>
        memo.then(genomes =>
          createGenome(row).then(genome => genomes.concat(genome))
        ),
        Promise.resolve([])
      )),
  ])).
  then(([ species, genomes ]) => species.addReferences(genomes)).
  then(() => process.exit(0)).
  catch(console.error).
    then(() => process.exit(1));
