const sanitize = require('sanitize-filename');
const csv = require('csv');
const Genome = require('models/genome');

const { request } = require('services');

const { transformer } = require('../utils/speciator');

module.exports = (req, res, next) => {
  const { user } = req;
  const { collectionId } = req.params;
  const { ids } = req.body;
  const { filename: rawFilename = '' } = req.query;
  const filename = sanitize(rawFilename) || 'speciator.csv';

  const genomeIds = ids ? ids.split(',') : null;

  res.set({
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-type': 'text/csv',
  });

  request('collection', 'authorise', { user, id: collectionId, projection: { genomes: 1 } })
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
