/* eslint-disable no-console,camelcase,max-len */
const mongoConnection = require('utils/mongoConnection');
const { ObjectId } = require('mongoose/lib/types');
const Genome = require('models/genome');
const argv = require('named-argv');
const fs = require('fs');

const separator = ",";
const defaultProjection = {
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
  'analysis.genotyphi.genotype': 1,
  'analysis.genotyphi.foundLoci': 1,
  'analysis.kleborate.amr': 1,
  'analysis.kleborate.csv': 1,
  'analysis.poppunk2.strain': 1,
  'analysis.serotype.value': 1,
  'analysis.spn_pbp_amr': 1,
};

const _user = new ObjectId("623b3dac8f2efe62c2e69fa8");

function getSpeciesQuery(taxId, field = 'analysis.speciator.organismId') {
  const baseQuery = {
    _user,
    binned: false,

  };
  baseQuery[field] = taxId;
  return baseQuery;
}

const queries = {
  aba: {
    query: getSpeciesQuery('470'),
  },
  cco: {
    query: getSpeciesQuery('195'),
  },
  cje: {
    query: getSpeciesQuery('197'),
  },
  ent: {
    query: getSpeciesQuery('547', 'analysis.speciator.genusId'),
    projection: { 'analysis.speciator.organismName': 1 },
  },
  eco: {
    query: getSpeciesQuery('562'),
  },
  efa: {
    query: getSpeciesQuery('1352'),
  },
  hae: {
    query: getSpeciesQuery('727'),
  },
  hpy: {
    query: getSpeciesQuery('210'),
  },
  kle: {
    query: getSpeciesQuery('570', 'analysis.speciator.genusId'),
  },
  kpn: {
    query: getSpeciesQuery('573'),
  },
  mtb: {
    query: getSpeciesQuery('1773'),
  },
  ngo: {
    query: getSpeciesQuery('485'),
  },
  pae: {
    query: getSpeciesQuery('287'),
  },
  sau: {
    query: getSpeciesQuery('1280'),
  },
  sal: {
    query: getSpeciesQuery('28901'),
  },
  sfl: {
    query: getSpeciesQuery('623'),
  },
  shi: {
    query: getSpeciesQuery('620', 'analysis.speciator.genusId'),
  },
  sty: {
    query: getSpeciesQuery('90370'),
  },
  spn: {
    query: getSpeciesQuery('1313'),
  },
  ssn: {
    query: getSpeciesQuery('624'),
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
        if (!!row[task] && !!row[task][column]) {
          values.push(row[task][column]);
        }
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
    console.log("--species={id}\n");
    console.log(Object.keys(queries));
    process.exit(1);
  }

  await mongoConnection.connect();
  const projection = !!queries[species].projection ? { ...defaultProjection, ...queries[species].projection } : defaultProjection;
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
    analysis: { mlst, mlst2, genotyphi, kleborate, poppunk2, serotype, speciator, spn_pbp_amr } = {},
  } of genomes) {
    const metadata = { name, longitude, latitude, country, day, month, year };
    if (!!mlst) {
      metadata.mlst = { ST: mlst.st, url: mlst.url };
      metadata.mlst.MLST_Profile = mlst.alleles.map(({ hits }) => hits.join('|')).join('.');
      if (!('mlst' in foundTasks)) {
        foundTasks.mlst = Object.keys(metadata.mlst);
      }
    }
    if (!!mlst2) {
      metadata.mlst2 = { ST2: mlst2.st, url2: mlst2.url };
      metadata.mlst2.MLST_Profile2 = mlst2.alleles.map(({ hits }) => hits.join('|')).join('.');
      if (!('mlst2' in foundTasks)) {
        foundTasks.mlst2 = Object.keys(metadata.mlst2);
      }
    }
    if (!!genotyphi) {
      metadata.genotyphi = { Genotype: genotyphi.genotype, SNPs_called: genotyphi.foundLoci };
      if (!('genotyphi' in foundTasks)) {
        foundTasks.genotyphi = Object.keys(metadata.genotyphi);
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
    if (!!poppunk2) {
      metadata.poppunk2 = { [poppunk2.label]: poppunk2.strain };
      if (!('poppunk2' in foundTasks)) {
        foundTasks.poppunk2 = Object.keys(metadata.poppunk2);
      }
    }
    if (!!serotype) {
      metadata.serotype = { Serotype: serotype.value };
      if (!('serotype' in foundTasks)) {
        foundTasks.serotype = Object.keys(metadata.serotype);
      }
    }
    if (!!speciator) {
      metadata.speciator = speciator;
      if (!('speciator' in foundTasks)) {
        foundTasks.speciator = Object.keys(metadata.speciator);
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
