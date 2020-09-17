const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');
const Genome = require('models/genome');
const mongoose = require('mongoose')

require('services');

function parseQuery() {
  const { query = '{ "none": false }' } = argv.opts;
  return JSON.parse(query);
}

async function fetchGenomes(query) {
  return Genome.find(query).lean();
}

async function main() {
  await mongoConnection.connect();
  const query = parseQuery();
  const userId = mongoose.Types.ObjectId(argv.opts.userId);
  if (!userId) return;
  const genomes = await fetchGenomes(query);
  console.info(`${genomes.length} being copied.`);
  genomes.forEach(genome => delete genome._id);
  genomes.forEach(genome => genome._user = userId);
  await Genome.insertMany(genomes)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
