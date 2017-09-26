const archiver = require('archiver');
const transform = require('stream-transform');

const CollectionGenome = require('models/collectionGenome');

const LOGGER = require('utils/logging').createLogger('Downloads');

const gffTransformer = (input) => {
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

  return output.join('\t') + '\n';
};

module.exports = (req, res, next) => {
  const { ids, filename = `wgsa-annotations-${Date.now()}.zip` } = req.query;

  if (!ids || typeof(ids) !== 'string' || ids === '') {
    LOGGER.error('Missing ids');
    return res.sendStatus(400);
  }

  const query = {
    _id: { $in: ids.split(',') },
    'analysis.core': { $exists: true },
    'analysis.mlst': { $exists: true },
    'analysis.paarsnp': { $exists: true },
  };
  const projection = {
    name: 1,
    'analysis.core.matches': 1,
    'analysis.mlst.matches': 1,
    'analysis.paarsnp.matches': 1,
  };
  const cursor = CollectionGenome.find(query, projection);

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'application/zip');

  const archive = archiver.create('zip');

  archive.on('error', function (err) {
    res.status(500).send({ error: err.message });
  });

  // on stream closed we can end the request
  archive.on('end', function () {
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  archive.pipe(res);

  cursor
    .cursor()
    .on('data', ({ name, analysis }) => {
      const stream = transform(gffTransformer);

      archive.append(stream, { name: `${name}.gff` });

      const { core, mlst, paarsnp } = analysis;

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
      // for (const match of mlst.matches) {
      //   stream.write(match);
      // }
      // for (const match of paarsnp.matches) {
      //   stream.write(match);
      // }
      stream.end();
    })
    .on('end', () => {
      archive.finalize((err) => {
        if (err) return next(err);
      });
    });
};
