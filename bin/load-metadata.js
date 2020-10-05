/* eslint-disable no-param-reassign */
const argv = require('named-argv');

const Genome = require('models/genome');
const mongoConnection = require('utils/mongoConnection');
const editMany = require('services/genome/edit-many');
const readCsv = require('../utils/read-csv');

function parseQuery() {
  const { query = '{}' } = argv.opts;
  return JSON.parse(query);
}

function checkOpts() {
  const { userId, query, csvFile } = argv.opts;

  if (!userId || !query || !csvFile) {
    console.log('Missing argument(s) (--userId, --query, --csvFile');
    process.exit(1);
  }
}

function fetchGenomes(query) {
  return Genome.find(query, {
    _id: 1,
    name: 1,
    userDefined: 1,
    year: 1,
    month: 1,
    day: 1,
    latitude: 1,
    longitude: 1,
    pmid: 1,
  }).lean();
}

function mapMetadata(metadataUpdate, genomes, nameColumn) {
  const metadataMap = metadataUpdate.reduce((memo, row) => {
    if (!row[nameColumn] && !row.userDefined[nameColumn]) {
      throw new Error(`Missing ${nameColumn} in ${JSON.stringify(row)}`);
    }
    const currentName = row[nameColumn] ? row[nameColumn] : row.userDefined[nameColumn];

    // if (!row[currentName]) {
    //   return memo;
    // }
    memo[currentName] = row;
    if (memo[currentName].day === 'Unknown' || !memo[currentName].day) {
      delete memo[currentName].day;
    }
    if (memo[currentName].month === 'Unknown' || !memo[currentName].month) {
      delete memo[currentName].month;
    }
    if (memo[currentName].year === 'Unknown' || !memo[currentName].year) {
      delete memo[currentName].year;
    }
    // memo[row.name].day = row.day !== 'Unknown' ? row.day : null;
    // memo[row.name].month = row.month !== 'Unknown' ? row.month : null;
    // memo[row.name].year = row.year !== 'Unknown' ? row.year : null;
    return memo;
  }, {});

  const mergedMetadata = genomes
    .filter(genome => metadataMap.hasOwnProperty(genome.name))
    .reduce((merged, genome) => {
      genome.id = genome._id.toString();
      delete genome._id;
      const metadata = metadataMap[genome.name];
      metadata.userDefined = { ...genome.userDefined, ...metadata.userDefined };
      const foo = { ...genome, ...metadata };
      console.log(`${JSON.stringify(Object.keys(foo))}`);
      merged[genome.name] = foo;
      return merged;
    }, {});
  return Object.values(mergedMetadata);
}

async function main() {
  checkOpts();
  const metadataUpdate = await readCsv(argv.opts.csvFile);
  await mongoConnection.connect();
  const query = parseQuery(argv.opts.query);
  query._user = argv.opts.userId;
  console.log(`Query: ${JSON.stringify(query)}`);
  const genomes = await fetchGenomes(query);
  const nameColumn = argv.opts.nameColumn ? argv.opts.nameColumn.toLowerCase() : 'name';
  const data = mapMetadata(metadataUpdate, genomes, nameColumn);
  const user = { _id: argv.opts.userId };
  await editMany({ user, data });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
