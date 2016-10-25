const fs = require('fs');
const async = require('async');

const storageConnection = require('utils/storageConnection');

const collectionId = process.argv[3];
fs.mkdir(collectionId);
fs.chdir(collectionId);

storageConnection.connect(connError => {
  if (connError) throw connError;

  const collection = require('models/collection');

  async.waterfall([
    done => collection.getMetadata(collectionId, done),
    ({ speciesId }, done) => collection.get({ collectionId, speciesId }, done),
    ({ assemblies, tree, subtrees, collectionSize }, done) => {
      let remaining = collectionSize;
      for (const assemblyId of Object.keys(assemblies)) {
        console.log(`Writing ${assemblyId}, ${remaining} remaining`);
        fs.writeFileSync(
          `WGSA_${assemblyId}.json`,
          JSON.stringify(assemblies(assemblyId))
        );
        remaining--;
      }
      done({ tree, subtrees });
    },
    (data, done) => collection.getMetadata(collectionId, (...args) => done(...args, data)),
    (doc, data, done) =>
      fs.writeFile(
        `CMD_${collectionId}.json`,
        JSON.stringify(Object.assign({}, doc, data)),
        done
      ),
  ], (error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    process.exit(0);
  });
});
