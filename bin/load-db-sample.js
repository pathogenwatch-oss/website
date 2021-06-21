/* eslint-disable no-console */

// Loads DB records into a test environment
// Records should be dumped with dump-db-sample.js

const fs = require('fs');
const argv = require('named-argv');
const es = require('event-stream');
const { Writable } = require('stream');

const mongoConnection = require('utils/mongoConnection');

const Genome = require('models/genome');
const Collection = require('models/collection');
const Organism = require('models/organism');
const store = require('utils/object-store');

const { ObjectId } = require('mongoose').Types;

async function process(line) {
  const data = JSON.parse(line);
  const { doc, type } = data;
  let model;
  switch (type) {
    case 'genome':
      model = Genome;
      break;
    case 'collection':
      model = Collection;
      break;
    case 'analysis':
      model = 'Analysis';
      break;
    case 'organism':
      model = Organism;
      break;
    default:
      return undefined;
  }

  const { _id, ...rest } = doc;
  if (!_id) return undefined; // not sure why this happened but it's not good

  // I tried doing a traditional "upsert" but had a problem with some documents
  // and a date field.  This seems to be quick and actually work.
  try {
    if (model === 'Analysis') return await store.putAnalysis(doc.task, doc.version, doc.fileId, doc.organismId, doc);
    return await model.collection.findOneAndReplace({ _id: ObjectId(_id) }, rest, { upsert: true }); // eslint-disable-line new-cap
  } catch (err) {
    err.doc = { _id, type };
    throw err;
  }
}

async function main() {
  const { input } = argv.opts;
  if (!input || input === true) {
    console.log("Expected --input=XXX (i.e. the output from dump-db-sample.js)");
    process.exit(1);
  }

  await mongoConnection.connect();

  /* eslint-disable-next-line new-cap */
  const output = Writable({
    write(line, _, cb) {
      if (!line || line.length < 2) return cb();
      return process(line)
        .then(() => cb())
        .catch((err) => {
          console.error(err);
          this.errorCount = (this.errorCount || 0) + 1;
          this.lastError = err;
          cb();
        });
    },
  });

  fs.createReadStream(input)
    .pipe(es.split())
    .pipe(output);

  await new Promise((resolve, reject) => {
    output.on('finish', () => resolve());
    output.on('error', (err) => reject(err));
  });

  mongoConnection.close();
  console.log(`Completed with ${output.errorCount || 0} error(s)`);
  if (output.errorCount) {
    const { doc } = output.lastError;
    console.log(`Problem with ${doc.type} doc ${doc._id}`);
    throw output.lastError;
  }

}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
