const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');
const mapLimit = require('promise-map-limit');
const User = require('models/user');
const { getTasksByOrganism } = require('manifest');
const { enqueue } = require('models/queue');

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

async function cleanGenome(genome, userId, update) {
  // Remove all analysis which is no longer applicable
  // to this genome and user
  const { analysis = {} } = genome;
  const { speciator = {} } = analysis;
  const user = await User.findById(userId, { flags: 1 });
  if (!user) return;
  const tasks = getTasksByOrganism(speciator, user);
  const expectedTasks = new Set([ ...tasks.map(_ => _.task), 'speciator' ]);
  const unset = {};
  const existingTasks = Object.keys(genome.analysis || {});
  for (const task of existingTasks) {
    if (!expectedTasks.has(task)) unset[`analysis.${task}`] = true;
  }
  if (Object.keys(unset).length > 0) {
    await genome.update({ $unset: unset });
  }
  const { organismId, speciesId, genusId, superkingdomId } = speciator;
  if (update) {
    const uploadedAt = new Date();
    for (const task of tasks) {
      const metadata = {
        genomeId: genome._id,
        fileId: genome.fileId,
        organismId,
        speciesId,
        genusId,
        superkingdomId,
        uploadedAt: new Date(uploadedAt),
      };
      enqueue(task, metadata, queue);
    }
  }
}

const { queue = 'reprocessing' } = argv.opts;

async function updateGenome({ _id, fileId, _user }, clean, update) {
  await submit({ genomeId: _id, fileId, userId: _user, queue });
  const genome = await Genome.findById(_id);
  if (genome && clean) {
    await cleanGenome(genome, _user, update);
  }
}

function updateGenomeAnalysis(genomes, clean = false, update = false) {
  return mapLimit(genomes, limit, genome => updateGenome(genome, clean, update));
}

async function main() {
  await mongoConnection.connect();
  const query = parseQuery();
  const genomes = await fetchGenomes(query);
  const clean = !!argv.opts.clean;
  const update = !!argv.opts.update;
  await updateGenomeAnalysis(genomes, clean, update);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
