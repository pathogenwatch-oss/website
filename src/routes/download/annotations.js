const archiver = require('archiver');
const transform = require('stream-transform');

const CollectionGenome = require('models/collectionGenome');

const LOGGER = require('utils/logging').createLogger('Downloads');

const header = '##gff-version 3.2.1';

const gffTransformer = input => {
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
};

function convertDocumentToGFF({ name, analysis }, stream) {
  const { core, mlst, paarsnp } = analysis;

  stream.write(header);

  for (const { id, partial, matches } of core.matches) {
    for (const match of matches) {
      stream.write({
        sequence: id,
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
      phase: (start - 1) % 3,
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
  const { ids, filename = `wgsa-annotations-${Date.now()}` } = req.query;

  if (!ids || typeof(ids) !== 'string' || ids === '') {
    LOGGER.error('Missing ids');
    return res.sendStatus(400);
  }

  try {
    const $in = ids.split(',');

    const query = {
      _id: { $in },
      'analysis.core': { $exists: true },
      'analysis.mlst': { $exists: true },
      'analysis.paarsnp': { $exists: true },
    };
    const projection = {
      name: 1,
      'analysis.core.matches': 1,
      'analysis.mlst.matches': 1,
      'analysis.paarsnp': 1,
    };
    const cursor = CollectionGenome.find(query, projection);

    if ($in.length > 1) {
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.zip`);
      res.setHeader('Content-Type', 'application/zip');

      const archive = archiver.create('zip');

      archive.on('error', next);

      archive.pipe(res);

      cursor
        .cursor()
        .on('data', doc => {
          const stream = transform(gffTransformer);
          archive.append(stream, { name: `${doc.name}.gff` });
          convertDocumentToGFF(doc, stream);
          stream.end();
        })
        .on('end', () => {
          archive.finalize();
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
