const Genome = require('models/genome');
const Analysis = require('models/analysis');
const mongoConnection = require('utils/mongoConnection');
const mapLimit = require('promise-map-limit');

const limit = 2;

// Script is to add the organismId to records already in the cache.
// This fixes the current cache for the future and so I don't expect
// this script to be run more than once.

async function updateAnalysis(taskRecord) {
  const { organismId, task, fileId, version } = JSON.parse(taskRecord);
  if (task !== 'speciator') {
    await Analysis.findOneAndUpdate(
      { task, fileId, version },
      { organismId },
      { returnNewDocument: false, strict: false });
  }
}

function updateAnalyses(tasks) {
  return mapLimit(tasks, limit, task => updateAnalysis(task));
}

// Get all the analyses to update as a list of JSON strings
// If a genome appears more than once a superset of the analyses are kept
// organismId is compared as a sanity check
async function fetchTaskData(query) {
  const genomes = await Genome.find(query, '-_id fileId analysis').lean().exec();
  const taskData = new Set();
  genomes.forEach((genome) => {
    const fileId = genome.fileId;
    // Check if the genome has the analysis field & speciator record.
    // If not it's a dodgy assembly that was never processed and should be ignored.
    if (!!genome.analysis && !!genome.analysis.speciator) {
      const organismId = genome.analysis.speciator.organismId;
      // There's an average of 2.5 records per fileId, the section below ensures they are merged correctly.
      Object.keys(genome.analysis).forEach((task) => {
        taskData.add(JSON.stringify({ fileId, organismId, task, version: genome.analysis[task].__v }));
      });
    } else {
      // Should always have the same organismId for each file ID, so if not, fail.
      console.log(`Speciator error with fileID ${genome.fileId}`);
    }
  });
  return [ ...taskData ];
}

async function main() {
  await mongoConnection.connect();
  const query = { fileId: { $ne: null }, analysis: { $ne: null } };
  const taskData = await fetchTaskData(query);
  await updateAnalyses(taskData);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
