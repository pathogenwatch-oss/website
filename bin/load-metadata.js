const argv = require('named-argv');
const fs = import('fs')

const Genome = require('models/genome');
const mongoConnection = require('utils/mongoConnection');
const editMany = require('services/genome/edit-many')
const readCsv = require('../utils/read-csv')

function parseQuery() {
  const { query = '{}' } = argv.opts;
  return JSON.parse(query);
}

function checkOpts() {
  const { userId, query, csvFile } = argv.opts;

  if (!userId || !query || !csvFile) {
    console.log(`Missing argument(s) (--userId, --query, --csvFile`);
    process.exit(1);
  }
}

function fetchGenomes(query) {
  return Genome.find(query, {
    _id: 1,
    name: 1,
  }).lean();
}

function mapMetadata(metadataUpdate, genomes) {
  const metadataMap = metadataUpdate.reduce((memo, row) => {
    memo[row['name']] = row;
    memo[row['name']].day =  row.day !== 'Unknown' ? row.day : null
    memo[row['name']].month =  row.month !== 'Unknown' ? row.month : null
    memo[row['name']].year =  row.year !== 'Unknown' ? row.year : null
    return memo;
  }, {});

  genomes.forEach(genome => {
    if (genome.name in metadataMap) {
      metadataMap[genome.name].id = genome._id.toString();
    }
  });
  return Object.values(metadataMap);
}

async function main() {
  checkOpts();
  const metadataUpdate = await readCsv(argv.opts.csvFile)
  await mongoConnection.connect();
  const query = parseQuery(argv.opts.query);
  query._user = argv.opts.userId;
  console.log(`Query: ${query}`)
  const genomes = await fetchGenomes(query);
  const data = mapMetadata(metadataUpdate, genomes);
  const user = { '_id': argv.opts.userId}
  await editMany({ user, data })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
