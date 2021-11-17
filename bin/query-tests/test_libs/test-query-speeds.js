/* eslint-disable no-console */
const { performance } = require('perf_hooks');
const { max, mean, min, standardDeviation } = require('simple-statistics');

const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');
const fs = require('fs');
const Genome = require('models/genome');

const { queryFile, outfile = 'speeds.csv', repeats = "10" } = argv.opts;
const repeatsNum = parseInt(repeats, 10);

if (!queryFile) {
  throw new Error('--query_file not provided.');
}

function readInput() {
  return JSON.parse(fs.readFileSync(queryFile, 'utf-8'));
}

async function timeQuery(queryFunction) {
  const startTime = performance.now();

  await queryFunction();

  const endTime = performance.now();

  // console.log(`${startTime} - ${endTime}`);
  return endTime - startTime;
}

async function executeQueries(queries) {
  const results = [];
  for (const query of queries) {
    const testFunction = "pipeline" in query ? async () => Genome.aggregate(query.pipeline) : async () => Genome.find(query.query, query.view, query.bounds).lean();
    console.log(`Testing ${query.name}`);
    const times = Array(repeatsNum);
    for (const test of times.keys()) {
      times[test] = await timeQuery(testFunction);
    }
    results.push({ name: query.name, times });
  }
  return results;
}

function createStatistics(results) {
  const stats = [];
  for (const { name, times } of results) {
    stats.push({
      name,
      sampleCount: times.length,
      mean: mean(times),
      standardDeviation: standardDeviation(times),
      max: max(times),
      min: min(times),
    });
  }
  return stats;
}

function report(statistics) {
  const writeStream = fs.createWriteStream(outfile);
  writeStream.write("Query,Sample Count,Mean,Standard Deviation,Fastest,Slowest\n");
  statistics.forEach((queryStats) => {
    writeStream.write(`${queryStats.name},${queryStats.sampleCount},${queryStats.mean},${queryStats.standardDeviation},${queryStats.max},${queryStats.min}\n`);
  });
  writeStream.close();
}

async function run() {
  await mongoConnection.connect();
  const queries = readInput();
  const results = await executeQueries(queries);
  const statistics = createStatistics(results);
  report(statistics);
  await mongoConnection.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
