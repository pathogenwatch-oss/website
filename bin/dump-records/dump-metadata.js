/* eslint-disable no-console */
const mongoConnection = require('utils/mongoConnection');
const Genome = require('models/genome');
const argv = require('named-argv');
const fs = require('fs');

const separator = ",";

const projection = {
  name: 1,
  fileId: 1,
  latitude: 1,
  longitude: 1,
  userDefined: 1,
  _id: 0,
};

function printTable(header, rows) {
  const stream = fs.createWriteStream(`metadata.csv`);
  stream.write(`${header.join(separator)}\n`);
  for (const row of rows) {
    stream.write(`${header.map(field => `"${row[field]}"`).join(separator)}\n`);
  }
  stream.on('finish', () => {
    process.exit(0);
  });
  stream.end();
}

async function main() {
  const { queryString } = argv.opts;

  if (!queryString) {
    console.log("--queryString={id}\n");
    process.exit(0);
  }

  await mongoConnection.connect();

  const query = JSON.parse(queryString);

  const genomes = await Genome
    .find(query, projection)
    .lean();

  const rows = [];
  const header = new Set([ 'name', 'fileId', 'latitude', 'longitude' ]);
  for (const { name, fileId, latitude, longitude, userDefined = {} } of genomes) {
    Object.keys(userDefined).map(field => header.add(field));
    rows.push({
      name,
      fileId,
      latitude,
      longitude,
      ...userDefined,
    });
  }
  printTable(Array.from(header.values()), rows);
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
