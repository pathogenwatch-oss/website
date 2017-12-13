const transform = require('stream-transform');
const ZipStream = require('zip-stream');
const async = require('async');

const Genome = require('models/genome');
const { request } = require('services');
const LOGGER = require('utils/logging').createLogger('Downloads');

const header = '##gff-version 3.2.1';

function getCollectionGenomes({ genomes }, genomeIds) {
  const query = {
    _id: { $in: genomeIds },
    $or: [
      { _id: { $in: genomes } },
      { public: true },
    ],
    'analysis.core': { $exists: true },
    'analysis.mlst': { $exists: true },
    'analysis.paarsnp': { $exists: true },
  };
  const projection = {
    name: 1,
    'analysis.core.profile': 1,
    'analysis.mlst.matches': 1,
    'analysis.paarsnp': 1,
  };
  const options = {
    sort: {
      name: 1,
    },
  };
  return Genome
    .find(query, projection, options);
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

  // const profile = core.profile;
  const profile = core.profile.map(x => x.familyId).sort().map(x => core.profile.find(y => y.familyId === x));
  for (const { familyId, refLength, alleles } of profile) {
    for (const allele of alleles) {
      stream.write({
        sequence: allele.qId,
        source: 'WGSA_Core',
        type: 'CDS',
        start: allele.qR[0],
        end: allele.qR[1],
        score: allele.pid,
        reversed: (allele.qR[0] > allele.qR[1]),
        phase: (allele.rR[0] - 1) % 3,
        attributes: {
          ID: `CORE_${allele.qId}_${allele.qR[0]}_${allele.qR[1]}`,
          name: familyId,
          target: `${familyId} ${allele.rR[0]} ${refLength}`,
          targetLength: refLength,
          notes: [
            `Paralogue ${alleles.length}`,
            allele.full ? 'Complete Match' : 'Partial Match',
          ].join(','),
          evalue: allele.evalue,
        },
      });
    }
  }

  for (const { gene, id, start, end, contig } of mlst.matches) {
    stream.write({
      sequence: contig,
      source: 'WGSA_MLST',
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

  for (const match of paarsnp.matches) {
    if (match.source === 'WGSA_PAAR') {
      stream.write({
        sequence: match.query.id,
        source: match.source,
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
          note: match.agents.join(','),
          evalue: match.evalue,
          targetLength: match.library.length,
        },
      });
    } else if (match.type === 'point_mutation') {
      stream.write({
        sequence: match.id,
        source: match.source,
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
        source: match.source,
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
          evalue: match.evalue,
          targetLength: match.library.length,
        },
      });
    }
  }
}

function generateData(collection, genomeIds, filename, res, next) {
  const cursor = getCollectionGenomes(collection, genomeIds);
  console.error(genomeIds, genomeIds.length);
  if (genomeIds && genomeIds.length === 1) {
    cursor.then(([ doc ]) => {
      console.error({doc});
      const stream = transform(gffTransformer);
      res.setHeader('Content-Disposition', `attachment; filename=${filename || doc.name}.gff`);
      res.setHeader('Content-Type', 'text/plain');
      stream.pipe(res);
      convertDocumentToGFF(doc, stream);
      stream.end();
    });
  }
  else {
    res.setHeader('Content-Disposition', `attachment; filename=${filename || 'wgsa-annotations.zip'}`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = new ZipStream();

    archive.on('error', next);

    archive.pipe(res);

    const _cursor = cursor.lean().cursor();

    async.doUntil(done => {
      _cursor.next((error, doc) => {
        if (error) {
          done(error);
          return;
        }
        if (!doc) {
          done(null, true);
          return;
        }
        const stream = transform(gffTransformer);
        archive.entry(stream, { name: `${doc.name}.gff` }, (err) => {
          if (err) {
            done(err);
            return;
          }
          done(null, false);
        });
        convertDocumentToGFF(doc, stream);
        stream.end();
      });
    },
    isDone => isDone,
    (error) => {
      if (error) {
        next(error);
        return;
      }
      archive.finish();
    });
  }
}

module.exports = (req, res, next) => {
  const { user } = req;
  const { uuid } = req.params;
  const { ids } = req.query;
  const { filename } = req.query;

  if (!uuid || typeof uuid !== 'string') {
    LOGGER.error('uuid not provided.');
    res.status(400).send('`uuid` parameter is required.');
    return;
  }

  if (ids && typeof ids !== 'string') {
    LOGGER.error('ids parameter is invalid.');
    res.status(400).send('`ids` parameter is invalid.');
    return;
  }
  const genomeIds = ids ? ids.split(',') : null;

  req.on('close', () => console.log('CLOSED'));

  request('collection', 'authorise', { user, uuid, projection: { genomes: 1 } })
    .then(collection => generateData(collection, genomeIds, filename, res, next))
    .catch(next);
};
