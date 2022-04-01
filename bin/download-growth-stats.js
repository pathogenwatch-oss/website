/* eslint-disable no-console,max-len */
const mongoConnection = require('utils/mongoConnection');
const Genome = require('models/genome');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Script downloads CSV of:
// genome ID, first uploaded at, public/private, organism name

async function extractEarliestUploads() {
  await mongoConnection.connect();
  const genomes = await Genome.find(
    { $or: [ { 'analysis.metrics.length': { $gt: 500000 } }, { 'analysis.speciator.organismId': '2697049' } ] },
    {
      _id: 0,
      fileId: 1,
      latitude: 1,
      longitude: 1,
      public: 1,
      createdAt: 1,
      'analysis.speciator.organismName': 1,
    }, { sort: { createdAt: 1 } }).lean();
  const memo = {};
  let publicCounter = 0;
  for (const genome of genomes) {
    const genomeId = genome.fileId;
    const access = !!genome.public ? 'public' : 'private';
    if (!('createdAt' in genome && 'analysis' in genome && 'speciator' in genome.analysis)) continue;
    if (!(genomeId in memo)) {
      memo[genomeId] = {
        genomeId,
        date: `${genome.createdAt.getFullYear()}/${genome.createdAt.getMonth() + 1}/${genome.createdAt.getDate()}`,
        year: genome.createdAt.getFullYear(),
        month: genome.createdAt.getMonth() + 1,
        day: genome.createdAt.getDate(),
        access,
        timestamp: genome.createdAt.getTime(),
        organismName: genome.analysis.speciator.organismName,
      };
    }
    if ('latitude' in genome && !('latitude' in memo[genomeId])) {
      memo[genomeId].latitude = genome.latitude;
      memo[genomeId].longitude = genome.longitude;
    }
    if (access === 'public') {
      memo[genomeId].access = access;
      publicCounter += 1;
    }
  }
  console.error(`Public counter = ${publicCounter}`);
  return memo;
}


async function main() {
  const genomes = await extractEarliestUploads();
  const csvWriter = createCsvWriter({
    path: 'uploads.csv',
    header: [
      { id: 'genomeId', title: 'Genome UUID' },
      { id: 'date', title: 'Date' },
      { id: 'latitude', title: 'Latitude' },
      { id: 'longitude', title: 'Longitude' },
      // { id: 'year', title: 'Year' },
      // { id: 'month', title: 'Month' },
      // { id: 'day', title: 'Day' },
      { id: 'organismName', title: 'Organism' },
      { id: 'access', title: 'Public/Private' },
    ],
  });
  csvWriter.writeRecords(Object.values(genomes)).then(() => {
    console.error('Written uploads.csv');
    process.exit(0);
  });
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
