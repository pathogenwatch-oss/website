/* eslint-disable no-console,camelcase */
const mongoConnection = require('utils/mongoConnection');
const { ObjectId } = require('mongoose/lib/types');
const Genome = require('models/genome');
const argv = require('named-argv');
const fs = require('fs');

const separator = ",";
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
  'analysis.mlst.url': 1,
  'analysis.mlst2.st': 1,
  'analysis.mlst2.alleles': 1,
  'analysis.mlst2.url': 1,
  'analysis.kleborate.amr': 1,
  'analysis.kleborate.csv': 1,
  'analysis.serotype.value': 1,
  'analysis.spn_pbp_amr': 1,
};

const _user = new ObjectId("623b3dac8f2efe62c2e69fa8");

const queries = {
  aba: {
    query: {
      _user,
      binned: false,
      'analysis.speciator.organismId': '470',
    },
  },
  cco: {
    query: {
      _user,
      binned: false,
      'analysis.speciator.organismId': '195',
    },
  },
  cje: {
    query: {
      _user,
      binned: false,
      'analysis.speciator.organismId': '197',
    },
  },
  eco: {
    query: {
      _user,
      binned: false,
      'analysis.speciator.organismId': '562',
    },
  },
  kpn: {
    query: {
      $or: [
        { binned: false, public: true, 'analysis.speciator.organismId': '573' },
        {
          _user,
          binned: false,
          'analysis.speciator.organismId': '573',
        },
      ],
    },
  },
  ngo: {
    query: {
      _user,
      binned: false,
      'analysis.speciator.organismId': '485',
    },
  },
  pae: {
    query: {
      _user,
      binned: false,
      'analysis.speciator.organismId': '287',
    },
  },
  sau: {
    query: {
      _user,
      binned: false,
      'analysis.speciator.organismId': '1280',
    },
  },
  sal: {
    query: {
      _user,
      binned: false,
      'analysis.speciator.organismId': '28901',
    },
  },
  shi: {
    query: {
      _user,
      binned: false,
      'analysis.speciator.genusId': '620',
    },
  },
  sty: {
    query: {
      _user,
      binned: false,
      'analysis.speciator.organismId': '90370',
    },
  },
  spn: {
    query: {
      _user,
      binned: false,
      'analysis.speciator.organismId': '1313',
    },
  },
};
function writeOutput(species, foundTasks, rows) {
  const header = [ "Name", "Latitude", "Longitude", "Country", "Year", "Month", "Day" ];
  const tasks = Object.keys(foundTasks);
  for (const task of tasks) {
    header.push(foundTasks[task].join(separator));
  }
  const stream = fs.createWriteStream(`${species}.csv`);

  stream.write(`${header.join(separator)}\n`);
  for (const row of rows) {
    const values = [ row.name, row.latitude, row.longitude, row.country, row.year, row.month, row.day ];
    for (const task of tasks) {
      for (const column of foundTasks[task]) {
        (!!row[task] && !!row[task][column]) ? values.push(row[task][column]) : '';
      }
    }
    stream.write(`${values.join(separator)}\n`);
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
  for (const {
    name,
    longitude,
    latitude,
    country,
    day,
    month,
    year,
    // eslint-disable-next-line camelcase
    analysis: { mlst, mlst2, kleborate, serotype, spn_pbp_amr } = {},
  } of genomes) {
    const metadata = { name, longitude, latitude, country, day, month, year };
    if (!!mlst) {
      metadata.mlst = { ST: mlst.st, url: mlst.url };
      metadata.mlst['MLST Profile'] = mlst.alleles.map(({ hits }) => hits.join('|')).join('.');
      if (!('mlst' in foundTasks)) {
        foundTasks.mlst = Object.keys(metadata.mlst);
      }
    }
    if (!!mlst2) {
      metadata.mlst2 = { "ST 2": mlst2.st, url2: mlst2.url };
      metadata.mlst2['MLST Profile 2'] = mlst2.alleles.map(({ hits }) => hits.join('|')).join('.');
      if (!('mlst2' in foundTasks)) {
        foundTasks.mlst2 = Object.keys(metadata.mlst2);
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
    if (!!serotype) {
      metadata.serotype = { Serotype: serotype.value };
      if (!('serotype' in foundTasks)) {
        foundTasks.serotype = Object.keys(metadata.serotype);
      }
    }
    if (!!spn_pbp_amr) {
      metadata.spn_pbp_amr = spn_pbp_amr;
      if (!('spn_pbp_amr' in foundTasks)) {
        foundTasks.spn_pbp_amr = Object.keys(metadata.spn_pbp_amr);
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
