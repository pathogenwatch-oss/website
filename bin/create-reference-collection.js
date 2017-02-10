const promisify = require('promisify-node');
const fs = promisify('fs');
const argv = require('named-argv');
const path = require('path');

const Collection = require('models/collection');
const Genome = require('models/genome');
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

const systemMetadataColumns = new Set([
  'assemblyId', 'uuid', 'speciesId', 'fileId', 'collectionId', 'pmid',
  'filename', 'assemblyname', 'displayname', 'name',
  'date', 'year', 'month', 'day',
  'position', 'latitude', 'longitude',
]);

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
        const value = values[index];
        if (header === 'displayname') {
          memo.name = value;
        } else if (systemMetadataColumns.has(header)) {
          memo[header] = value;
        } else {
          memo.userDefined[header] = value;
        }
        return memo;
      }, { userDefined: {} });
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
  then(() => Promise.all([
    Genome.remove({ speciesId, reference: true }),
    Collection.remove({ uuid: speciesId, reference: true }), // for testing
  ])).
  then(() =>
    fs.readFile(csvFile, 'utf8').
      then(parseRows).
      then(rows => rows.reduce((memo, row) =>
        memo.then(genomes =>
          createGenome(row).then(genome => genomes.concat(genome))
        ),
        Promise.resolve([])
      ))
  ).
  then(collectionGenomes =>
    Collection.create({
      size: collectionGenomes.length,
      speciesId,
      title: `temp ${speciesId} reference collection`,
      reference: true,
    }).
    then(collection =>
      Promise.all([
        collection.addUUID(speciesId),
        request('collection', 'add-genomes', { collection, collectionGenomes }),
      ])
    )
  ).
  then(() => process.exit(0)).
  catch(console.error).
    then(() => process.exit(1));
