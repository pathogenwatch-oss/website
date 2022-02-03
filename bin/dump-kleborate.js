/* eslint-disable no-console */
// A simple script to dump the kleborate data as a CSV. It's not good, but it worked for what I needed.
const fs = require('fs');
const mongoConnection = require('utils/mongoConnection');
const Stream = require('stream');

const Genome = require('models/genome');
const csv = require('csv');
const { transformer } = require('../src/routes/download/utils/kleborate');

function fetchGenomes(query, projection) {
  return Genome.find(query, projection).lean();
}

async function main() {
  const query = {
    public: true,
    binned: false,
    'analysis.kleborate': { $exists: true },
    'analysis.speciator.genusId': { $in: [ '570', '160674' ] },
    'analysis.kleborate.__v': 'v2.2.1',
  };
  const projection = { name: 1, 'analysis.kleborate': 1 };
  await mongoConnection.connect();

  const genomes = await fetchGenomes(query, projection);

  const readable = new Stream.Readable({ objectMode: true });
  const writable = new Stream.Writable({ objectMode: true });

  writable._write = (object, encoding, done) => {
    fs.appendFileSync('test.csv', object);
    // process.stdout.write(object);
    // process.exit(0);
    done();
  };

  readable.pipe(csv.stringify({ header: true, quotedString: true })).pipe(writable);

  for (const genome of genomes) {
    const record = transformer(genome);
    readable.push(record);
  }

  // end the stream
  readable.push(null);
  console.log("Done");
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
