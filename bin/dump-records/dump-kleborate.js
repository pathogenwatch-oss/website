/* eslint-disable no-console */
// A simple script to dump the kleborate data as a CSV. It's not good, but it worked for what I needed.
const fs = require('fs');
const mongoConnection = require('utils/mongoConnection');
const Stream = require('stream');

const Genome = require('models/genome');
const csv = require('csv');
const { transformer } = require('../../src/routes/download/utils/kleborate');
const { ObjectId } = require('mongoose/lib/types');

function fetchGenomes(query, projection) {
  return Genome.find(query, projection).lean();
}

async function main() {
  // const { query } = argv.opts;

  const query = { _user: new ObjectId("623b3dac8f2efe62c2e69fa8"), 'analysis.kleborate': { $exists: true } };

  // const query = {
  //   public: true,
  //   binned: false,
  //   'analysis.kleborate': { $exists: true },
  //   'analysis.speciator.genusId': { $in: [ '570', '160674' ] },
  //   'analysis.kleborate.__v': 'v2.2.1',
  // };
  const projection = { name: 1, 'analysis.kleborate': 1 };
  await mongoConnection.connect();

  const writable = fs.createWriteStream('/tmp/kleborate.csv');

  await Genome.find(query, projection)
    .cursor()
    .pipe(csv.transform(transformer))
    .pipe(csv.stringify({ header: true, quotedString: true }))
    .pipe(writable);

  writable.on('finish', () => {
    console.log("Done");
    process.exit(0);
  });
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
