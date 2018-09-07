const transform = require('stream-transform');
const ZipStream = require('zip-stream');
const sanitize = require('sanitize-filename');
const es = require('event-stream');
const { Writable } = require('stream');

const Genome = require('models/genome');
const Analysis = require('models/analysis');
const { request } = require('services');
const LOGGER = require('utils/logging').createLogger('Downloads');

const header = '##gff-version 3.2.1';

function getGenomeSummaries(query) {
  const projection = {
    name: 1,
    fileId: 1,
    'analysis.core.__v': 1,
    'analysis.mlst.matches': 1,
    'analysis.paarsnp': 1,
  };
  const options = { sort: { name: 1 } };
  const genomes = Genome.find(query, projection, options).lean().cursor();
  const fileIds = new Set();
  const genomeLookup = {};
  const coreVersionMap = {};
  return new Promise((resolve, reject) => {
    genomes.on('data', genome => {
      const { fileId, analysis: { core } } = genome;
      genomeLookup[fileId] = genomeLookup[fileId] || [];
      genomeLookup[fileId].push(genome);
      coreVersionMap[core.__v] = coreVersionMap[core.__v] || [];
      coreVersionMap[core.__v].push(fileId);
      fileIds.add(fileId);
    });
    genomes.on('error', err => reject(err));
    genomes.on('end', () => resolve({
      fileIds: [ ...fileIds ],
      genomeLookup,
      coreVersionMap,
    }));
  });
}

function getGenomes(fileIds, genomeLookup, coreVersionMap) {
  const query = {
    task: 'core',
    $or: [],
  };

  for (const version of Object.keys(coreVersionMap)) {
    query.$or.push({ version, fileId: { $in: coreVersionMap[version] } });
    coreVersionMap[version] = null;
  }

  const cores = Analysis.find(query, {
    fileId: 1,
    version: 1,
    results: 1,
  }).lean().cursor();

  const coreFormatter = es.through(function (core) {
    const { fileId, version, results } = core;
    const genomes = genomeLookup[fileId] || [];
    for (const genome of genomes) {
      if (!genome.analysis || !genome.analysis.core) continue;
      if (genome.analysis.core.__v === version) {
        this.emit('data', {
          ...genome,
          analysis: {
            ...genome.analysis,
            core: results,
          },
        });
      }
    }
    genomeLookup[fileId] = null;
  });

  return cores.pipe(coreFormatter);
}

async function getCollectionGenomes({ genomes }, genomeIds) {
  const query = {
    _id: { $in: genomeIds },
    $or: [
      { _id: { $in: genomes } },
      { public: true },
    ],
  };
  const summaries = await getGenomeSummaries(query);
  const { fileIds, genomeLookup, coreVersionMap } = summaries;
  return getGenomes(fileIds, genomeLookup, coreVersionMap);
}

function gffTransformer(input) {
  if (input === header) return `${input}\n`;
  const output = [
    input.sequence,
    input.source,
    input.type,
    input.start,
    input.end,
    input.score,
    input.reversed !== null ? (input.reversed ? '-' : '+') : null,
    input.phase,
    Object.keys(input.attributes)
      .map(key => `${key}=${input.attributes[key]}`)
      .join(';'),
  ]
  .map(value => (value === null ? '.' : value));

  return `${output.join('\t')}\n`;
}

function convertDocumentToGFF(doc, stream) {
  const { core, mlst, paarsnp } = doc.analysis;

  stream.write(header);

  if (core) {
    const profile = core.profile.map(x => x.id).sort().map(x => core.profile.find(y => y.id === x));
    for (const { id, rlength, alleles } of profile) {
      for (const allele of alleles) {
        stream.write({
          sequence: allele.qid,
          source: 'Pathogenwatch_Core',
          type: 'CDS',
          start: allele.qstart,
          end: allele.qstop,
          score: allele.pid,
          reversed: (allele.rstart > allele.rstop),
          phase: (allele.rstart - 1) % 3,
          attributes: {
            ID: `CORE_${allele.qid}_${allele.rstart}_${allele.rstop}`,
            name: id,
            target: `${id} ${allele.rstart} ${rlength}`,
            targetLength: rlength,
            notes: [
              `Paralogue ${alleles.length}`,
              allele.complete ? 'Complete Match' : 'Partial Match',
            ].join(','),
            evalue: allele.evalue,
          },
        });
      }
    }
  }

  if (mlst) {
    for (const { gene, id, start, end, contig } of mlst.matches) {
      stream.write({
        sequence: contig,
        source: 'Pathogenwatch_MLST',
        type: 'genetic_marker',
        start,
        end,
        score: null, // match.identity,
        reversed: end < start,
        phase: null,
        attributes: {
          ID: `MLST_${contig}_${start}_${end}`,
          name: `${gene}_${id}`,
          // target: `${match.reference.id} ${match.reference.start} ${match.reference.length}`,
          // targetLength: match.reference.length,
          note: `FamilyAllele ${id}`,
          // evalue: match.evalue,
        },
      });
    }
  }

  if (paarsnp) {
    for (const match of paarsnp.matches) {
      if (match.source.indexOf('PAAR') !== -1) {
        stream.write({
          sequence: match.query.id,
          source: 'Pathogenwatch_PAAR',
          type: match.type,
          start: match.query.start,
          end: match.query.stop,
          score: match.identity,
          reversed: match.reversed,
          phase: (match.query.start - 1) % 3,
          attributes: {
            ID: `PAAR_${match.query.id}_${match.query.start}_${match.query.stop}`,
            name: match.id,
            target: `${match.id} ${match.library.start} ${match.library.length}`,
            targetLength: match.library.length,
            note: match.agents.join(','),
            evalue: match.evalue,
          },
        });
      } else if (match.type === 'point_mutation') {
        stream.write({
          sequence: match.id,
          source: 'Pathogenwatch_SNPAR',
          type: match.type,
          start: match.queryLocation,
          end: match.queryLocation,
          score: null,
          reversed: match.reversed,
          phase: null,
          attributes: {
            ID: `SNPAR_${match.name}`,
            name: match.name,
            parent: `${match.id}_${match.libraryStart}`,
            target: `${match.id} ${match.referenceLocation} ${match.referenceLocation}`,
            note: match.agents.join(','),
          },
        });
      } else {
        stream.write({
          sequence: match.query.id,
          source: 'Pathogenwatch_SNPAR',
          type: match.type,
          start: match.query.start,
          end: match.query.stop,
          score: match.identity,
          reversed: match.reversed,
          phase: (match.query.start - 1) % 3,
          attributes: {
            ID: `SNPAR_${match.query.id}_${match.query.start}_${match.query.stop}`,
            name: match.id,
            target: `${match.library.id} ${match.library.start} ${match.library.length}`,
            targetLength: match.library.length,
            evalue: match.evalue,
          },
        });
      }
    }
  }
}

async function generateData(collection, genomeIds, filename, res, next) {
  const genomes = await getCollectionGenomes(collection, genomeIds);
  genomes.on('error', next);

  if (genomeIds && genomeIds.length === 1) {
    const stream = transform(gffTransformer);
    stream.on('error', next);
    stream.pipe(res);

    genomes.on('data', doc => {
      res.setHeader('Content-Disposition', `attachment; filename=${filename || `${doc.name}.gff`}`);
      res.setHeader('Content-Type', 'text/plain');
      convertDocumentToGFF(doc, stream);
    });
    genomes.on('end', () => stream.end());
  } else {
    res.setHeader('Content-Disposition', `attachment; filename=${filename || 'pathogenwatch-annotations.zip'}`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = new ZipStream();
    archive.on('error', next);
    archive.pipe(res);

    const createArchive = new Writable({
      objectMode: true,
      write(doc, _, callback) {
        if (!doc) {
          callback();
          return;
        }
        const stream = transform(gffTransformer);
        archive.entry(stream, { name: `${doc.name}.gff` }, (err) => {
          if (err) {
            callback(err);
            return;
          }
          callback();
        });
        convertDocumentToGFF(doc, stream);
        stream.end();
      },
      final(callback) {
        archive.finish();
        callback();
      },
    });

    genomes.pipe(createArchive);
  }
}

module.exports = async (req, res, next) => {
  const { user } = req;
  const { token } = req.params;
  const { ids } = req.method === 'GET' ? req.query : req.body;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename);
  const genomeIds = ids ? ids.split(',') : null;

  const collection = await request('collection', 'authorise', { user, token, projection: { genomes: 1 } });
  try {
    await generateData(collection, genomeIds, filename, res, next);
  } catch (e) {
    next(e);
  }
};
