/* eslint-disable no-console */
const mongoConnection = require('utils/mongoConnection');
const { ObjectId } = require('mongoose/lib/types');
const Genome = require('models/genome');
const argv = require('named-argv');
const fs = require('fs');

const projection = {
  name: 1,
  latitude: 1,
  longitude: 1,
  country: 1,
  day: 1,
  month: 1,
  year: 1,
  'analysis.mlst.st': 1,
  'analysis.mlst.alleles': 1,
  'analysis.kleborate.amr': 1,
  'analysis.kleborate.csv': 1,
};
const _user = new ObjectId("623b3dac8f2efe62c2e69fa8");

const queries = {
  kpn: {
    query: {
      $or: [ { binned: false, public: true, 'analysis.speciator.organismId': '573' }, {
        _user,
        binned: false,
        'analysis.speciator.organismId': '573'
      }, ],
    },
  },
};

function writeOutput(species, foundTasks, rows) {
  const header = [ "Name", "Latitude", "Longitude", "Country", "Year", "Month", "Day" ];
  const tasks = Object.keys(foundTasks);
  for (const task of tasks) {
    header.concat(foundTasks[task]);
  }
  const stream = fs.createWriteStream(`${species}.csv`);
  stream.write(`${header.join(",")}\n`);

  for (const row of rows) {
    const values = [ row.name, row.latitude, row.longitude, row.country, row.year, row.month, row.day ];
    for (const task of tasks) {
      for (const column of foundTasks[task]) {
        (!!row[task] && !!row[task][column]) ? values.push(row[task][column]) : '';
      }
    }
    stream.write(`${values.join(",")}\n`);
  }
  stream.on('finish', () => {
    process.exit(0);
  });
  stream.end();
}

async function main() {
  const { species } = argv.opts;

  if (!species || !(species in queries)) {
    console.log(Object.keys(queries));
    process.exit(1);
  }

  await mongoConnection.connect();

  const genomes = await Genome.find(queries[species].query, projection).lean();
  const foundTasks = {};
  const rows = [];
  for (const { name, longitude, latitude, country, day, month, year, analysis: { mlst, kleborate } = {} } of genomes) {
    const metadata = { name, longitude, latitude, country, day, month, year };
    if (!!mlst) {
      metadata.mlst = { ST: mlst.st };
      metadata.mlst.Profile = mlst.alleles.map(({ hits }) => hits.join('|')).join('.');
      if (!('mlst' in foundTasks)) {
        foundTasks.mlst = Object.keys(metadata.mlst);
      }
    }
    if (!!kleborate) {
      metadata.kleborate = {};
      kleborate.csv.forEach((item) => {
        if (item.set === 'amr') metadata.kleborate[item.name] = kleborate[item.set].classes[item.field];
      });
      if (!('kleborate' in foundTasks)) {
        foundTasks.kleborate = Object.keys(metadata.kleborate);
      }
    }
    rows.push(metadata);
  }
  writeOutput(species, foundTasks, rows);
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
