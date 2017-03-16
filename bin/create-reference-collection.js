const fs = require('fs');
const argv = require('named-argv');
const path = require('path');

const Collection = require('models/collection');
const Genome = require('models/genome');
const { request } = require('services');
const mongoConnection = require('utils/mongoConnection');

const readMetadata = require('./read-metadata');

const {
  organismId,
  csvFile,
  fastaDir,
} = argv.opts;

console.log({ organismId, csvFile, fastaDir });

if (!organismId || !csvFile || !fastaDir) {
  console.log('Missing arguments');
  process.exit(1);
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
    Genome.remove({ organismId, reference: true }),
    Collection.remove({ uuid: organismId, reference: true }), // for testing
  ])).
  then(() =>
    readMetadata(csvFile).
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
      organismId,
      title: `temp ${organismId} reference collection`,
      reference: true,
    }).
    then(collection =>
      Promise.all([
        collection.addUUID(organismId),
        request('collection', 'add-genomes', { collection, collectionGenomes }),
      ])
    )
  ).
  then(() => process.exit(0)).
  catch(console.error).
    then(() => process.exit(1));
