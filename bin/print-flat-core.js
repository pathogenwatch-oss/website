const mongoConnection = require('utils/mongoConnection');
const mapLimit = require('promise-map-limit');
const path = require('path');
const fs = require('fs');

require('services');
const Genome = require('models/genome');
const Collection = require('models/collection');

const [ ,, collection ] = process.argv;

function fetchCollectionAndGenomes() {
  return Collection.findOne({ uuid: collection })
    .then(({ genomes }) =>
      Genome.find(
        { _id: { $in: genomes } },
        {
          name: 1,
          'analysis.core.profile': 1,
        }
      )
      .lean()
    );
}

function print(oldCore) {
  const lines = [];
  const keys = oldCore.profile.map(x => x.id).sort();
  for (const id of keys) {
    const profile = oldCore.profile.find(x => x.id === id);
    lines.push([ 'familyId\t\t', id ].join(''));
    if (profile.filter) continue;
    // lines.push(['alleles\t\t', profile.alleles.length ].join(''));
    for (const allele of profile.alleles) {
      if (allele.filter) continue;
      lines.push([ 'allelesId\t', allele.id ].join(''));
      lines.push([ 'start\t\t', Math.min(allele.rstart, allele.rstop) ].join(''));
      lines.push([ 'stop\t\t', Math.max(allele.rstart, allele.rstop) ].join(''));
      const mutations = Object.keys(allele.mutations).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
      for (const key of mutations) {
        lines.push([ 'location\t', key ].join(''));
        lines.push([ 'mutation\t', allele.mutations[key.toString()] ].join(''));
      }
    }
  }

  return lines.join('\n');
}

function updateGenomes(genomes) {
  for (const genome of genomes) {
    fs.writeFileSync(
      'core/' + genome.name.replace('.fasta', '.txt'),
      print(genome.analysis.core)
    );
  }
}

mongoConnection.connect()
  .then(fetchCollectionAndGenomes)
  .then(updateGenomes)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
