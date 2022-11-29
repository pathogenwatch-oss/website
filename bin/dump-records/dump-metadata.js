/* eslint-disable no-console */
const mongoConnection = require('utils/mongoConnection');
const Genome = require('models/genome');
const argv = require('named-argv');
const fs = require('fs');

const separator = ",";

const fields = [ 'name', 'fileId', 'latitude', 'longitude', 'literaturelink', 'country' ];

const projection = {
  _id: 0,
  userDefined: 1,
  ...Object.fromEntries(fields.reduce((memo, field) => {
    memo.set(field, 1);
    return memo;
  }, new Map())),
};

function printTable(header, rows) {
  const stream = fs.createWriteStream(`metadata.csv`);
  stream.write(`${header.join(separator)}\n`);
  for (const row of rows) {
    stream.write(`${header.map(field => `"${!!row[field] ? row[field] : ''}"`).join(separator)}\n`);
  }
  stream.on('finish', () => {
    process.exit(0);
  });
  stream.end();
}

async function main() {
  const { queryString, uuids } = argv.opts;

  if (!!uuids) {
    projection._id = 1;
    fields.push('_id');
  }
  if (!queryString) {
    console.log("--queryString={query}\n");
    process.exit(0);
  }

  await mongoConnection.connect();

  const tempQuery = queryString === 'test' ? '{"public" : true, "analysis.speciator.organismId": "1313"}' : queryString;

  const query = JSON.parse(tempQuery);

  const genomes = await Genome
    .find(query, projection)
    .lean();

  const rows = [];
  const header = new Set(fields);
  for (const genome of genomes) {
    if (!('userDefined' in genome)) {
      genome.userDefined = {};
    }
    Object.keys(genome.userDefined).map(field => header.add(field));
    genome.literaturelink = 'literaturelink' in genome ? genome.literaturelink.value : '';
    const row = {
      ...genome.userDefined,
      ...Object.fromEntries(fields.reduce((memo, field) => {
        memo.set(field, genome[field]);
        return memo;
      }, new Map())),
    };
    rows.push(row);
  }
  printTable(Array.from(header.values()), rows);
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
