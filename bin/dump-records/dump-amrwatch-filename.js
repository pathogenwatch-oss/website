/* eslint-disable no-console */
const mongoConnection = require('utils/mongoConnection');
const { ObjectId } = require('mongoose/lib/types');
const Genome = require('models/genome');
const argv = require('named-argv');
const fs = require('fs');

const _user = new ObjectId("623b3dac8f2efe62c2e69fa8");
const separator = ',';

function writeOutput(species, rows) {
  const stream = fs.createWriteStream(`${species}.csv`);

  stream.write(`${[ 'Name', 'Checksum' ].join(separator)}\n`);
  for (const row of rows) {
    stream.write(`${row.join(separator)}\n`);
  }
  stream.on('finish', () => {
    process.exit(0);
  });
  stream.end();
}

async function main() {
  const { taxid } = argv.opts;

  if (!taxid) {
    console.log("Supply an organism or genus taxonomy code as --taxid=666");
    process.exit(1);
  }

  await mongoConnection.connect();

  const genomes = await Genome.find(
    {
      $or: [ { _user, 'analysis.speciator.speciesId': taxid }, {
        _user,
        'analysis.speciator.organismId': taxid,
      } ]
    },
    {
      name: 1,
      fileId: 1,
    }).lean();
  const rows = [];
  for (const { name, fileId } of genomes) {
    rows.push([ name, fileId ]);
  }
  writeOutput(taxid, rows);
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
