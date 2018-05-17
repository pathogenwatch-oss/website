const mongoConnection = require('utils/mongoConnection');

const Genome = require('models/genome');
const Collection = require('models/collection');

async function run() {
  const collections = await Collection.find({ published: true });
  for (const collection of collections) {
    console.log('Updating', collection.size, 'genomes');
    await Genome.update(
      { _id: { $in: collection.genomes } },
      { population: true },
      { multi: true }
    );
  }
}

(async function() {
  try {
    await mongoConnection.connect();
    await run();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}());
