const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');
const Genome = require('models/genome');
const Queue = require('models/queue');
const mapLimit = require('promise-map-limit');

const limit = 1000;
const defaultPriority = -100000;

function parseQuery() {
  const { query = '{ "analysis.speciator": { "$exists": false } }' } = argv.opts;
  return JSON.parse(query);
}

function fetchGenomes(query) {
  return Genome.find(query, { _id: 1, fileId: 1, _user: 1 }).lean();
}

async function cleanGenome(genome) {
  await Genome.update({ _id: genome._id }, { $set: { 'analysis': {} } });
}

async function speciateGenome(genome, version, clean, overridePriority) {
  if (clean) {
    await cleanGenome(genome);
  }
  await Queue.enqueue({
    spec: {
      name: "speciator",
      version,
      task: "speciator",
      timeout: 300,
      resources: {
        cpu: 1,
        memory: 1073741824,
      },
      taskType: "genome",
    },
    metadata: {
      genomeId: genome._id,
      fileId: genome.fileId,
      uploadedAt: new Date(genome.uploadedAt),
      clientId: "admin",
      userId: genome._user,
    },
    queue: 'normal',
    overridePriority,
  });
}

function speciate(genomes, version, clean = false, priority = defaultPriority) {
  return mapLimit(genomes, limit, genome => speciateGenome(genome, version, clean, priority));
}

async function main() {
  await mongoConnection.connect();
  const version = !!argv.opts.version ? argv.opts.version : null;
  const priority = !!argv.opts.priority ? argv.opts.priority : defaultPriority;
  if (!version || !argv.opts.query) {
    console.log(`--version=[speciator version] --query='{...}' --priority=[number: default=${defaultPriority}]`);
    process.exit(0);
  }
  const query = parseQuery();
  const genomes = await fetchGenomes(query);
  const clean = !!argv.opts.clean ? argv.opts.clean : false;
  await speciate(genomes, version, clean, priority);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
