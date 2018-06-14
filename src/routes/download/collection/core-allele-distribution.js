const transform = require('stream-transform');
const es = require('event-stream');
const sanitize = require('sanitize-filename');
const Genome = require('models/genome');
const Analysis = require('models/analysis');

const { request } = require('services');

function writeLines(columns, genomes, res) {
  const totalGenomes = {};
  const totalSequences = {};

  const stream = transform(data => data.join(',') + '\n');
  stream.pipe(res);

  res.write('Family ID,');
  stream.write(columns);

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

function getGenomes(query, fileIds, genomeLookup) {
  const cores = Analysis.find(query, {
    fileId: 1,
    results: 1,
  }).lean().cursor();

  const coreFormatter = es.through(function (core) {
    const { fileId, results } = core;
    genomeLookup[fileId] = genomeLookup[fileId] || [];
    for (const { name } of genomeLookup[fileId]) {
      const genome = {
        name,
        analysis: { core: results },
      };
      this.emit('data', genome);
    }
    genomeLookup[fileId] = [];
  });

  return cores.pipe(coreFormatter);
}

function getColumns(query) {
  let columns = new Set();
  const cores = Analysis.find(query, {
    fileId: 1,
    'results.profile.id': 1,
  }).lean().cursor();

  return new Promise((resolve, reject) => {
    cores.on('data', ({ results }) => {
      const newColumns = (results.profile || []).map(({ id }) => id);
      columns = new Set([ ...columns, ...newColumns ]);
    });
    cores.on('error', err => reject(err));
    cores.on('end', () => resolve([ ...columns ]));
  });
}

function getGenomeSummaries(query) {
  const genomes = Genome.find(query, { name: 1, fileId: 1 }).lean().cursor();
  const fileIds = new Set();
  const genomeLookup = {};
  return new Promise((resolve, reject) => {
    genomes.on('data', genome => {
      const { fileId } = genome;
      genomeLookup[fileId] = genomeLookup[fileId] || [];
      genomeLookup[fileId].push(genome);
      fileIds.add(fileId);
    });
    genomes.on('error', err => reject(err));
    genomes.on('end', () => resolve({ fileIds: [ ...fileIds ], genomeLookup }));
  });
}

module.exports = async (req, res, next) => {
  const { user } = req;
  const { token } = req.params;
  const { ids } = req.body;

  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'core-allele-distribution.csv';
  const genomeIds = ids ? ids.split(',') : null;

  res.set({
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-type': 'text/csv',
  });

  const collection = await request('collection', 'authorise', { user, token, projection: { genomes: 1, 'tree.versions': 1 } });
  try {
    const coreVersion = ((collection.tree || {}).versions || {}).core || null;
    if (!coreVersion) throw new Error("Couldn't create download without core version");

    const genomesQuery = {
      _id: { $in: genomeIds },
      $or: [
        { _id: { $in: collection.genomes } },
        { public: true },
      ],
    };
    const { fileIds, genomeLookup } = await getGenomeSummaries(genomesQuery);

    const analysisQuery = {
      task: 'core',
      fileId: { $in: fileIds },
      version: coreVersion,
    };
    const columns = await getColumns(analysisQuery);
    const genomes = getGenomes(analysisQuery, fileIds, genomeLookup);

    writeLines(columns, genomes, res);
  } catch (err) {
    next(err);
  }
};
