const mongoConnection = require('utils/mongoConnection');
const { ObjectId } = require('mongoose/lib/types');
const Genome = require('models/genome');
const argv = require('named-argv');
const fs = require('fs');

const projection = {
  _id: 1,
  name: 1,
  'analysis.speciator': 1,
};

const baseQuery = {
  binned: false,
  'analysis.speciator': { $exists: true },
};

function writeOutput(rows) {
  const header = [ "uuid", "name", "Species", "Mash distance", "p-value", "Matching hashes", "Confidence" ];

  const stream = fs.createWriteStream('out.csv');

  stream.write(`${header.join(",")}\n`);
  for (const row of rows) {
    const values = [
      row._id,
      row.name,
      row.analysis.speciator.speciesName,
      row.analysis.speciator.mashDistance,
      row.analysis.speciator.pValue,
      row.analysis.speciator.matchingHashes,
      row.analysis.speciator.confidence ];
    stream.write(`${values.join(",")}\n`);
  }
  stream.on('finish', () => {
    process.exit(0);
  });
  stream.end();
}

async function main() {
  const names = fs.readFileSync(argv.opts.names, 'utf8').split('\n');
  const query = baseQuery;
  query.name = { $in: names };
  query._user = new ObjectId(argv.opts.user);
  await mongoConnection.connect();
  const genomes = await Genome.find(query, projection).lean();
  const rows = [];
  for (const genome of genomes) {
    rows.push(genome);
  }
  writeOutput(rows);
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
