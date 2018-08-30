const mongoConnection = require('utils/mongoConnection');
const mapLimit = require('promise-map-limit');

const Genome = require('models/genome');

async function run() {
  const genomes = await Genome.find(
    { public: true, 'userDefined.display_name': { $exists: true } },
    { 'userDefined.display_name': 1 },
  ).lean();

  console.log('Number of genomes:', genomes.length);

  await mapLimit(
    genomes,
    1000,
    ({ _id, userDefined: { display_name } }) =>
      Genome.update({ _id }, { $set: { name: display_name }, $unset: { 'userDefined.display_name': 1 } })
  );
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
