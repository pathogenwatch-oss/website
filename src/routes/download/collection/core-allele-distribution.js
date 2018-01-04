const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const transform = require('stream-transform');
const Genome = require('models/genome');

const { request } = require('services');

function getCollectionGenomes(collection, genomeIds) {
  const query = {
    _id: { $in: genomeIds },
    $or: [
      { _id: { $in: collection.genomes } },
      { public: true },
    ],
  };
  return Genome
    .find(query, {
      name: 1,
      'analysis.core.profile.id': 1,
      'analysis.core.profile.alleles.id': 1,
    }, {
      sort: { name: 1 },
    })
    .lean()
    .cursor();
}

function writeLines(columns, genomes, res) {
  const totalGenomes = {};
  const totalSequences = {};
  const stream = transform(data => data.join(',') + '\n');

  stream.pipe(res);

  const headers = [ '', ...columns ];
  stream.write(headers);

  genomes.on('data', genome => {
    const line = [];
    line.push(genome.name);

    const allelesByFamilyId = {};
    for (const { id, alleles } of genome.analysis.core.profile) {
      allelesByFamilyId[id] = alleles;
    }

    for (const familyId of columns) {
      const cell = [];
      const alleles = allelesByFamilyId[familyId];
      if (alleles) {
        totalGenomes[familyId] = (totalGenomes[familyId] || 0) + 1;
        totalSequences[familyId] = (totalSequences[familyId] || 0) + alleles.length;
        for (const allele of alleles) {
          cell.push(allele.id);
        }
        allelesByFamilyId[familyId] = undefined;
      }
      line.push(cell.join(' '));
    }
    stream.write(line);
  });

  genomes.on('error', err => {
    throw err;
  });

  genomes.on('end', () => {
    let line = [];
    line.push('No. genomes');
    for (const familyId of columns) {
      line.push(totalGenomes[familyId].toString() || '');
    }
    stream.write(line);

    line = [];
    line.push('No. sequences');
    for (const familyId of columns) {
      line.push(totalSequences[familyId].toString() || '');
    }
    stream.write(line);

    line = [];
    line.push('Avg. sequences per genome');
    for (const familyId of columns) {
      if (totalGenomes[familyId] > 0) {
        const avg = Math.round((totalSequences[familyId] || 0) / totalGenomes[familyId]);
        line.push(avg.toString());
      }
    }
    stream.write(line);

    stream.end();
  });
}

function getColumns(organismId) {
  return readFile(path.join('core', `${organismId}.json`))
    .then(file => {
      const json = JSON.parse(file);
      return Object.keys(json.referenceAlleles).sort();
    });
}

module.exports = (req, res, next) => {
  const { user } = req;
  const { uuid } = req.params;
  const { ids } = req.body;
  const { filename = 'core-allele-distribution.csv' } = req.query;

  if (!uuid || typeof uuid !== 'string') {
    res.status(400).send('`uuid` parameter is required.');
    return;
  }

  if (ids && typeof ids !== 'string') {
    res.status(400).send('`ids` parameter is invalid.');
    return;
  }
  const genomeIds = ids ? ids.split(',') : null;

  res.set({
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-type': 'text/csv',
  });

  request('collection', 'authorise', { user, uuid, projection: { organismId: 1, genomes: 1 } })
    .then(async collection => {
      const columns = await getColumns(collection.organismId);
      const genomes = getCollectionGenomes(collection, genomeIds);
      writeLines(columns, genomes, res);
    })
    .catch(next);
};
