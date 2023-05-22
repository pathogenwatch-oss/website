/* eslint-disable no-console */
const mongoConnection = require('utils/mongoConnection');
const Genome = require('models/genome');
const Queue = require('models/queue');

const rand = require("rand-token");
const fetchQueueMessage = require('services/clustering/fetch-queue-message');
const argv = require("named-argv");

const overridePriority = 6;
const clientId = "adminScript";

async function extractOrganisms(filterArr = []) {
  const query = { public: true, 'analysis.cgmlst': { $exists: true } };
  const organismIds = await Genome.distinct('analysis.speciator.organismId', query);
  const projection = {
    'analysis.speciator.organismId': 1,
    // 'analysis.cgmlst.scheme': 1,
    // '__v': 1,
  };
  const organisms = [];
  for (const organismId of organismIds) {
    if (filterArr.length > 0 && !filterArr.includes(organismId)) continue;

    const organismQuery = { ...query, 'analysis.speciator.organismId': organismId };
    const organism = await Genome.findOne(organismQuery, projection).lean();
    organisms.push({
      genomeId: organism._id.toString(),
    });
  }
  return organisms;
}

async function main() {
  const { filter = "" } = argv.opts;
  const filterArr = filter !== "" ? filter.split(',') : [];

  await mongoConnection.connect();
  const organisms = await extractOrganisms(filterArr);
  for (const organism of organisms) {
    const { scheme, organismId, spec } = await fetchQueueMessage({
      genomeId: organism.genomeId,
    });
    const taskId = rand.generate(16);
    const metadata = { scheme, organismId, clientId, taskId };
    await Queue.enqueue({ metadata, spec, overridePriority });
    console.log(`Enqueued ${organismId} (${scheme})`);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
