// Loads DB records into a test environment
// Records should be dumped with dump-db-sample.js

const bson = require('bson');
const fs = require('fs');
const argv = require('named-argv');
const es = require('event-stream');
const { Writable } = require('stream');

const BSON = new bson();
const mongoConnection = require('utils/mongoConnection');

const Genome = require('models/genome');
const Collection = require('models/collection');
const Analysis = require('models/analysis');
const Organism = require('models/organism');

const { ObjectId } = require('mongoose').Types

function deserialize(rawDoc) {
  return BSON.deserialize(Buffer.from(rawDoc, 'base64'))
}

async function process(line) {
  const data = JSON.parse(line);
  const { doc: rawDoc, type } = data;
  const doc = deserialize(rawDoc);
  const { _id, ...rest } = doc;
  if (!_id) return; // not sure why this happened but it's not good
  let model
  switch (type) {
    case 'genome':
      model = Genome
      break
    case 'collection':
      model = Collection
      break
    case 'analysis':
      model = Analysis
      break
    case 'organism':
      model = Organism
      break
    default:
     return
  }
  // I tried doing a traditional "upsert" but had a problem with some documents
  // and a date field.  This seems to be quick and actually work.
  try {
    return await model.collection.findOneAndReplace({_id: ObjectId(_id)}, rest, { upsert: true })
  } catch (err) {
    err.doc = { _id, type }
    throw err
  }
}

async function main() {
  const { input } = argv.opts;
  if (!input || input == true ) {
    console.log("Expected --input=XXX (i.e. the output from dump-db-sample.js)")
    process.exit(1)
  }

  await mongoConnection.connect();
   
  const output = Writable({
    write: function (line, _, cb) {
      if (!line || line.length < 2) return cb()
      process(line)
        .then(() => cb())
        .catch(err => {
          console.error(err);
          this.errorCount = (this.errorCount||0) + 1;
          this.lastError = err;
          cb()
        })
    }
  })
    
  fs.createReadStream(input)
    .pipe(es.split())
    .pipe(output)
  
  await new Promise((resolve, reject) => {
    output.on('finish', () => resolve())
    output.on('error', err => reject(err))
  })

  mongoConnection.close()
  console.log(`Completed with ${output.errorCount || 0} error(s)`)
  if (output.errorCount) {
    const { doc } = output.lastError;
    console.log(`Problem with ${doc.type} doc ${doc._id}`);
    throw output.lastError;
  };
  
  return   
}

main().catch(err => {
  console.log(err);
  process.exit(1);
})
