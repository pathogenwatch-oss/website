const Genome = require('models/genome');

const { request } = require('services');

function getCollectionGenomes({ genomes }) {
  return Genome
    .find(
      { _id: { $in: genomes } },
    {
      name: 1,
      'analysis.core.fp.reference': 1,
      'analysis.core.profile.filter': 1,
    },
      { sort: { name: 1 } }
    )
    .lean()
    .cursor();
}

function generateMatrix(genomesByFamilyId, genomes, stream) {
  {
    const line = [ 'Family ID', 'No. genomes', 'No. sequences', 'Avg sequences per genome' ];
    for (const genome of genomes) {
      line.push(genome.name.replace(/,/g, '_'));
    }
    stream.write(line.join(','));
    stream.write('\n');
  }

  for (const familyId of Object.keys(genomesByFamilyId).sort()) {
    const noGenomes = Object.keys(genomesByFamilyId[familyId]).length;
    let noSequences = 0;
    const line = [ familyId.replace(/,/g, '_'), noGenomes, 0, 0 ];
    for (const genome of genomes) {
      if (genomesByFamilyId[familyId][genome._id]) {
        noSequences += genomesByFamilyId[familyId][genome._id].length;
        line.push(genomesByFamilyId[familyId][genome._id].join(' '));
      } else {
        line.push('');
      }
    }
    line[2] = noSequences;
    line[3] = Math.round(noSequences / noGenomes);
    stream.write(line.join(','));
    stream.write('\n');
  }

  stream.end();
}

function generateData(genomes, stream) {
  const 
  const genomesByFamilyId = {};
  const labels = [];
  genomes.on('data', genome => {
    labels.push({ _id: genome._id.toString(), name: genome.name });
    for (const { familyId, alleles } of genome.analysis.core.profile) {
      const allelesByGenomeId = genomesByFamilyId[familyId] || {};
      allelesByGenomeId[genome._id] = alleles.map(_ => _.id);
      genomesByFamilyId[familyId] = allelesByGenomeId;
    }
  });

  genomes.on('error', err => {
    throw err;
  });

  genomes.on('end', () => {
    generateMatrix(genomesByFamilyId, labels, stream);
  });
}

module.exports = (req, res, next) => {
  const { user } = req;
  const { uuid } = req.params;
  const { filename = 'variance-summary' } = req.query;

  if (!uuid || typeof uuid !== 'string') {
    res.status(400).send('`uuid` parameter is required.');
    return;
  }

  res.set({
    'Content-Disposition': `attachment; filename="${filename}.csv"`,
    'Content-type': 'text/csv',
  });

  request('collection', 'authorise', { user, uuid, projection: { genomes: 1 } })
    .then(getCollectionGenomes)
    .then(genomes => generateData(genomes, res))
    .catch(next);
};
