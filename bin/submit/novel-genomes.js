const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');
const LOGGER = require('utils/logging').createLogger('novel-genome-upload');
const fs = require('fs').promises;
const store = require('utils/object-store');
const Genome = require('models/genome');
const submitGenome = require('services/tasks/submit-genome');
const { ObjectId } = require('mongoose/lib/types');

// Inputs:
// 1. User ID
// 2. csv w/ "name,fileId"

// Check if FASTA is in spaces
// Create genome record
// Submit speciator task to queue.

async function readGenomesFile(genomeFile) {
  const genomeCsv = await fs.readFile(genomeFile);
  return genomeCsv
    .toString()
    .trim()
    .split("\n")
    .map(row => {
      const values = row.split(',');
      return { name: values[0], fileId: values[1] };
    });
}

async function existenceValidated(genomes) {
  for (const { fileId } of genomes) {
    const metadata = await store.head(store.fastaKey(fileId));
    if (!metadata) {
      LOGGER.info(`No file found for ${fileId}`);
      return false;
    }
  }
  return true;
}

const uploadedAt = new Date();

async function createRecord(genome, _user) {
  const doc = await Genome.create({
    _user,
    fileId: genome.fileId,
    name: genome.name,
    reference: false,
    public: false,
    uploadedAt,
  });

  return doc._id.toString();
}

async function submit(genomeId, fileId, userId) {
  await submitGenome({
    genomeId: new ObjectId(genomeId),
    fileId,
    uploadedAt,
    clientId: "admin",
    userId: new ObjectId(userId),
  });
}

async function main() {
  await mongoConnection.connect();
  LOGGER.info("Connected to DB");
  if (!('csv' in argv.opts) || !('userId' in argv.opts)) {
    throw new Error('Usage: novel-genomes.js --csv={csv} --userId={userId}');
  }
  const userId = argv.opts.userId;
  const genomes = await readGenomesFile(argv.opts.csv);
  LOGGER.info(`${genomes.length} genomes to upload`);
  if (!(await existenceValidated(genomes))) {
    throw new Error('Not all the genomes were found in spaces');
  }
  for (const genome of genomes) {
    const genomeId = await createRecord(genome, userId);
    await submit(genomeId, genome.fileId, userId);
    LOGGER.debug(`${genomeId} submitted.`);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    LOGGER.error(error);
    process.exit(1);
  });
