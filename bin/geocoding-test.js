const mongoConnection = require('utils/mongoConnection');

const Genome = require('models/genome');
const geocoding = require('utils/geocoding');

async function main() {
  await mongoConnection.connect();
  const genomes = await Genome.find(
    {
      latitude: { $exists: true },
      longitude: { $exists: true },
      country: { $ne: null },
    },
    {
      latitude: 1,
      longitude: 1,
      country: 1,
    }
  ).lean();

  const total = genomes.length;
  const differences = {};
  let matching = 0;

  for (const { latitude, longitude, country } of genomes) {
    const code = geocoding.getCountryCode(latitude, longitude);
    if (code !== country) {
      differences[country] = differences[country] || { [code]: 0 };
      differences[country][code]++;
    } else {
      matching++;
    }
    console.log({
      total,
      matching,
      differences,
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
