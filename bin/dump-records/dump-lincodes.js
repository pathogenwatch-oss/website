/* eslint-disable no-console */
const mongoConnection = require('utils/mongoConnection');
const Genome = require('models/genome');
const argv = require('named-argv');

const projection = {
  name: 1,
  fileId: 1,
  'analysis.klebsiella-lincodes': 1,
};

async function main() {
  const { queryString } = argv.opts;

  if (!queryString) {
    console.log("--queryString={query}\n");
    process.exit(0);
  }

  await mongoConnection.connect();

  const query = JSON.parse(queryString);

  const genomes = await Genome
    .find(query, projection)
    .lean();

  console.error(`${genomes.length} genomes`);
  console.log(JSON.stringify(genomes));
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
