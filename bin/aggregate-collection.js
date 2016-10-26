const fs = require('fs');
const async = require('async');

const storageConnection = require('utils/storageConnection');

const collectionId = process.argv[2];

if (!fs.existsSync(collectionId)) {
  fs.mkdirSync(collectionId);
}

storageConnection.connect(connError => {
  if (connError) throw connError;

  const collection = require('models/collection');
  process.chdir(collectionId);

  async.waterfall([
    done => collection.getMetadata(collectionId, done),
    ({ speciesId }, done) => collection.get({ collectionId, speciesId }, done),
    ({ assemblies, tree, subtrees, collectionSize }, done) => {
      const assemblyIds = Object.keys(assemblies);
      let remaining = assemblyIds.length;
      for (const assemblyId of assemblyIds) {
        console.log(`Writing ${assemblyId}, ${remaining} remaining`);
        const { analysis, metadata } = assemblies[assemblyId];
        fs.writeFileSync(
          `WGSA_${assemblyId}.json`,
          JSON.stringify({ type: 'WGSA', assemblyId, metadata, analysis }, null, '  ')
        );
        remaining--;
      }
      done({ tree, subtrees });
    },
    (data, done) => collection.getMetadata(collectionId, (error, doc) => done(error, doc, data)),
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
