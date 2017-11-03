const transform = require('stream-transform');
const ZipStream = require('zip-stream');
const async = require('async');

const CollectionGenome = require('models/collectionGenome');

const LOGGER = require('utils/logging').createLogger('Downloads');

const header = '##gff-version 3.2.1';

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

  for (const { partial, matches } of core.matches) {
    for (const match of matches) {
      stream.write({
        sequence: match.query.id,
        source: 'WGSA_Core',
        type: 'CDS',
        start: match.query.start,
        end: match.query.stop,
        score: match.identity,
        reversed: match.reversed,
        phase: (match.reference.start - 1) % 3,
        attributes: {
          ID: `CORE_${match.query.id}_${match.query.start}_${match.query.stop}`,
          name: match.reference.id,
          target: `${match.reference.id} ${match.reference.start} ${match.reference.length}`,
          targetLength: match.reference.length,
          notes: [
            `Paralogue ${matches.length}`,
            partial ? 'Partial Match' : 'Complete Match',
          ].join(','),
          evalue: match.evalue,
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

module.exports = (req, res, next) => {
  const { ids = '', collection, filename = `wgsa-annotations-${Date.now()}.zip` } = req.query;

  if ((!ids || typeof(ids) !== 'string' || ids === '') && !collection) {
    LOGGER.error('ids or collection not provided.');
    return res.sendStatus(400);
  }

  req.on('close', () => console.log('CLOSED'));

  try {
    const $in = ids.split(',');
    const query = Object.assign({
      'analysis.core': { $exists: true },
      'analysis.mlst': { $exists: true },
      'analysis.paarsnp': { $exists: true },
    }, collection ? { _collection: collection } : { _id: { $in } });
    const projection = {
      name: 1,
      'analysis.core.matches': 1,
      'analysis.mlst.matches': 1,
      'analysis.paarsnp': 1,
    };
    const cursor = CollectionGenome.find(query, projection);

    if (collection || $in.length > 1) {
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
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
    } else {
      cursor.then(([ doc ]) => {
        const stream = transform(gffTransformer);
        res.setHeader('Content-Disposition', `attachment; filename=${doc.name}.gff`);
        res.setHeader('Content-Type', 'text/plain');
        stream.pipe(res);
        convertDocumentToGFF(doc, stream);
        stream.end();
      });
    }
  } catch (err) {
    next(err);
  }
};
