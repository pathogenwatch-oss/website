const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');
const mapLimit = require('promise-map-limit');
const User = require('models/user');
const { getTasksByOrganism } = require('manifest');

require('services');
const Genome = require('models/genome');
const submit = require('services/tasks/submit-genome');

const limit = 1000;

function parseQuery() {
  const { query = '{ "analysis.speciator": { "$exists": false } }' } = argv.opts;
  return JSON.parse(query);
}

function fetchGenomes(query) {
  return Genome.find(query, { fileId: 1, _user: 1 }).lean();
}

async function cleanGenome(genome, userId) {
  // Remove all analysis which is no longer applicable
  // to this genome and user
  const { analysis = {} } = genome;
  const { speciator = {} } = analysis;
  const { organismId, speciesId, genusId } = speciator;
  const user = await User.findById(userId, { flags: 1 });
  const tasks = getTasksByOrganism(organismId, speciesId, genusId, user);
  const expectedTasks = new Set([ ...tasks.map(_ => _.task), 'speciator' ]);
  const unset = {};
  const existingTasks = Object.keys(genome.analysis || {});
  for (const task of existingTasks) {
    if (!expectedTasks.has(task)) unset[`analysis.${task}`] = true;
  }
  if (Object.keys(unset).length > 0) {
    await genome.update({ $unset: unset });
  }
}

async function updateGenome({ _id, fileId, _user }, clean) {
  await submit({ genomeId: _id, fileId, userId: _user });
  const genome = await Genome.findById(_id);
  if (genome && clean) {
    await cleanGenome(genome, _user);
  }
}

function updateGenomeAnalysis(genomes, clean = false) {
  return mapLimit(
    genomes,
    limit,
    genome => updateGenome(genome, clean)
  );
}

async function main() {
  await mongoConnection.connect();
  const query = parseQuery();
  const genomes = await fetchGenomes(query);
  const clean = !!argv.opts.clean;
  await updateGenomeAnalysis(genomes, clean);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
