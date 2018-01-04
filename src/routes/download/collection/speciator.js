const csv = require('csv');
const Genome = require('models/genome');

const { request } = require('services');

const { transformer } = require('../utils/speciator');

module.exports = (req, res, next) => {
  const { user } = req;
  const { uuid } = req.params;
  const { ids } = req.body;
  const { filename = 'speciator.csv' } = req.query;

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

  request('collection', 'authorise', { user, uuid, projection: { genomes: 1 } })
    .then(collection => {
      const query = {
        _id: { $in: genomeIds },
        $or: [
          { _id: { $in: collection.genomes } },
          { public: true },
        ],
      };
      const projection = {
        name: 1,
        'analysis.speciator': 1,
      };
      return Genome.find(query, projection)
        .cursor()
        .pipe(csv.transform(transformer))
        .pipe(csv.stringify({ header: true, quotedString: true }))
        .pipe(res);
    })
    .catch(next);
};
