const { Readable } = require('stream');
const sanitize = require('sanitize-filename');
const Genome = require('models/genome');
const store = require('utils/object-store');
const { asyncWrapper } = require('utils/routes');

const { request } = require('services');

function writeLines(columns, genomes, res, next) {
  const totalGenomes = {};
  const totalSequences = {};

  function format(line) {
    return `${line.join(',')}\n`;
  }

  async function* gen() {
    yield format([ 'Genome ID', ...columns ]);
    for await (const genome of genomes) {
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
      yield format(line);
    }

    let line = [];
    line.push('No. genomes');
    for (const familyId of columns) {
      line.push(totalGenomes[familyId].toString() || '');
    }
    yield format(line);

    line = [];
    line.push('No. sequences');
    for (const familyId of columns) {
      line.push(totalSequences[familyId].toString() || '');
    }
    yield format(line);

    line = [];
    line.push('Avg. sequences per genome');
    for (const familyId of columns) {
      if (totalGenomes[familyId] > 0) {
        const avg = Math.round((totalSequences[familyId] || 0) / totalGenomes[familyId]);
        line.push(avg.toString());
      }
    }
    yield format(line);
  }

  const lines = Readable.from(gen());
  lines.on('error', (err) => next(err));
  lines.pipe(res);
}

function getGenomes(cores, genomeLookup) {
  async function* gen() {
    for await (const { fileId, results } of cores) {
      genomeLookup[fileId] = genomeLookup[fileId] || [];
      for (const { name } of genomeLookup[fileId]) {
        yield {
          name,
          analysis: { core: results },
        };
      }
      genomeLookup[fileId] = [];
    }
  }

  return Readable.from(gen());
}

async function getColumns(cores) {
  let columns = new Set();

  for await (const { results } of cores) {
    const newColumns = (results.profile || []).map(({ id }) => id);
    columns = new Set([ ...columns, ...newColumns ]);
  }

  return columns;
}

async function getGenomeSummaries(query) {
  const genomes = Genome.find(query, { name: 1, fileId: 1 }).lean().cursor();
  const fileIds = new Set();
  const genomeLookup = {};

  for await (const genome of genomes) {
    const { fileId } = genome;
    genomeLookup[fileId] = genomeLookup[fileId] || [];
    genomeLookup[fileId].push(genome);
    fileIds.add(fileId);
  }
  return { fileIds: [ ...fileIds ], genomeLookup };
}

async function* getCores(fileIds, version, organismId) {
  const analysisKeys = fileIds.map((fileId) => store.analysisKey('core', version, fileId, organismId));
  for await (const value of store.iterGet(analysisKeys)) {
    const doc = JSON.parse(value);
    if (doc) yield doc;
  }
}

module.exports = asyncWrapper(async (req, res, next) => {
  const { user } = req;
  const { token } = req.params;
  const { ids, subtree } = req.body;

  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'core-allele-distribution.csv';
  const genomeIds = ids ? ids.split(',') : null;

  if (subtree && typeof subtree !== 'string') {
    res.status(400).send('Invalid `subtree`.');
    return;
  }

  res.set({
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-type': 'text/csv',
  });

  const collection = await request('collection', 'authorise', {
    user,
    token,
    projection: { genomes: 1, organismId: 1, 'tree.versions': 1, 'subtrees.versions': 1, 'subtrees.name': 1 }
  });
  try {
    const tree = subtree ?
      collection.subtrees.find((_) => _.name === subtree) :
      collection.tree;

    const coreVersion = tree && tree.versions && tree.versions.core;
    if (!coreVersion) throw new Error("Couldn't create download without core version");

    const genomesQuery = {
      _id: { $in: genomeIds },
      $or: [
        { _id: { $in: collection.genomes } },
        { public: true },
      ],
    };
    const { fileIds, genomeLookup } = await getGenomeSummaries(genomesQuery);

    const columns = await getColumns(getCores(fileIds, coreVersion, collection.organismId));
    const genomes = getGenomes(getCores(fileIds, coreVersion, collection.organismId), genomeLookup);

    writeLines(columns, genomes, res, next);
  } catch (err) {
    next(err);
  }
});
