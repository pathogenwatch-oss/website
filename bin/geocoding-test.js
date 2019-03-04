const mongoConnection = require('utils/mongoConnection');

const Genome = require('models/genome');
const geocoding = require('geocoding');
// const geocoding = require('utils/geocoding');

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
    // { limit: 1 }
  ).lean();

  const total = genomes.length;
  const differences = {};
  let matching = 0;

  for (const { latitude, longitude, country } of genomes) {
    const code = geocoding.getCountryCode(latitude, longitude);
    // console.log({ code, country, latitude, longitude });
    if (code !== country) {
      differences[country] = differences[country] || { [code]: {} };
      differences[country][code][`${latitude},${longitude}`] =
        differences[country][code][`${latitude},${longitude}`] || 0;
      differences[country][code][`${latitude},${longitude}`]++;
    } else {
      matching++;
    }
  }
  require('fs').writeFileSync(
    'results.json',
    JSON.stringify(
      {
        total,
        matching,
        differences,
      },
      null,
      2
    )
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
