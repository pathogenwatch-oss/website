const mongoConnection = require('utils/mongoConnection');

const Collection = require('models/collection');
const Genomecollection = require('models/genomecollection');

mongoConnection.connect()
  .then(() => {
    const collections = Collection.find({}, { genomes: 1 }).cursor();
    return collections.eachAsync(async ({ _id, genomes }) => {
      console.log({ collection: _id, genomes: genomes.length });
      await Genomecollection.bulkWrite(
        genomes.map(_genome => ({
          updateOne: {
            filter: { _genome },
            update: { $addToSet: { collections: _id } },
            upsert: true,
          },
        })),
      );
    });
  })
  .then(() => process.exit(0));
