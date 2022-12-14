const transform = require('stream-transform');
const ZipStream = require('zip-stream');
const sanitize = require('sanitize-filename');
const { Writable, Readable } = require('stream');

const Genome = require('models/genome');
const store = require('utils/object-store');
const { asyncWrapper } = require('utils/routes');
const { request } = require('services');

const header = '##gff-version 3.2.1';

async function getGenomeSummaries(query) {
  const projection = {
    name: 1,
    fileId: 1,
    'analysis.core.__v': 1,
    'analysis.mlst.matches': 1,
    'analysis.paarsnp.matches': 1,
    'analysis.speciator.organismId': 1,
  };
  const options = { sort: { name: 1 } };
  const genomes = Genome.find(query, projection, options).lean().cursor();
  const fileIds = new Set();
  const genomeLookup = {};
  const coreVersionMap = {};
  for await (const genome of genomes) {
    const { fileId, analysis: { core } } = genome;
    const organismId = genome.analysis.speciator.organismId;
    genomeLookup[fileId] = genomeLookup[fileId] || [];
    genomeLookup[fileId].push(genome);
    if (core) {
      coreVersionMap[core.__v] = coreVersionMap[core.__v] || [];
      coreVersionMap[core.__v].push({ fileId, organismId });
    }
    fileIds.add(fileId);
  }
  return {
    fileIds: [ ...fileIds ],
    genomeLookup,
    coreVersionMap,
  };
}

function getGenomes(genomeLookup, coreVersionMap) {
  const analysisKeys = [];

  for (const version of Object.keys(coreVersionMap)) {
    for (const { fileId, organismId } of coreVersionMap[version]) {
      analysisKeys.push(store.analysisKey('core', version, fileId, organismId));
    }
  }

  async function* cores() {
    console.log(JSON.stringify(analysisKeys));
    for await (const value of store.iterGet(analysisKeys)) {
      if (value === undefined) continue;
      const { fileId, version, results } = JSON.parse(value);
      const genomes = genomeLookup[fileId] || [];
      for (const genome of genomes) {
        if (!genome.analysis || !genome.analysis.core) continue;
        if (genome.analysis.core.__v === version) {
          yield {
            ...genome,
            analysis: {
              ...genome.analysis,
              core: results,
            },
          };
        }
      }
    }
  }

  return Readable.from(cores());
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
  const { genomeLookup, coreVersionMap } = summaries;
  return getGenomes(genomeLookup, coreVersionMap);
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
      .map((key) => `${key}=${input.attributes[key]}`)
      .join(';'),
  ]
    .map((value) => (value === null ? '.' : value));

  return `${output.join('\t')}\n`;
}

function convertDocumentToGFF(doc, stream) {
  const { core, mlst, paarsnp } = doc.analysis;

  stream.write(header);

  // https://github.com/sanger-pathogens/Artemis/blob/master/etc/feature_keys_gff
  if (core) {
    const profile = core.profile.map((x) => x.id).sort().map((x) => core.profile.find((y) => y.id === x));
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
            Name: id,
            Target: `${id} ${allele.rstart} ${rlength}`,
            TargetLength: rlength,
            note: [
              `Paralogue ${alleles.length}`,
              allele.complete ? 'Complete Match' : 'Partial Match',
            ].join(', '),
            evalue: allele.evalue,
          },
        });
      }
    }
  }

  if (mlst) {
    for (const { gene, id, start, end, contig } of mlst.matches) {
      const [ qStart, qEnd ] = [ start, end ].sort((a, b) => {
        return a - b;
      });
      stream.write({
        sequence: contig,
        source: 'Pathogenwatch_MLST',
        type: 'match',
        start: qStart,
        end: qEnd,
        score: null, // match.identity,
        reversed: end < start,
        phase: null,
        attributes: {
          ID: `MLST_${contig}_${start}_${end}`,
          Name: `${gene}_${id}`,
          // target: `${match.reference.id} ${match.reference.start} ${match.reference.length}`,
          // targetLength: match.reference.length,
          note: `Family ${gene} Allele ${id}`,
          // evalue: match.evalue,
        },
      });
    }
  }

  if (paarsnp) {
    for (const match of paarsnp.matches) {
      stream.write({
        sequence: match.queryId,
        source: 'Pathogenwatch_AMR',
        type: 'CDS',
        start: match.queryStart,
        end: match.queryStop,
        score: match.pid,
        reversed: match.strand !== 'FORWARD',
        phase: (match.refStart - 1) % 3,
        attributes: {
          ID: `AMR_${match.queryId}_${match.queryStart}_${match.queryStop}`,
          Name: match.refId,
          Target: `${match.refId} ${match.refStart} ${match.refStop}`,
          TargetLength: match.refLength,
          note: "",
          evalue: match.evalue,
        },
      });
      if (match.resistanceVariants.length !== 0) {
        match.resistanceVariants.forEach(({ name, queryStart, queryEnd, refStart, refEnd }) => {
          stream.write({
            sequence: match.queryId,
            source: 'Pathogenwatch_AMR',
            type: 'sequence_difference',
            start: queryStart,
            end: queryEnd,
            score: null,
            reversed: match.strand !== 'FORWARD',
            phase: null,
            attributes: {
              ID: `AMR_${match.queryId}_${queryStart}_${name}`,
              Name: name,
              Target: `${match.queryId} ${refStart} ${refEnd}`,
            },
          });
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

    genomes.on('data', (doc) => {
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

module.exports = asyncWrapper(async (req, res, next) => {
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
});
