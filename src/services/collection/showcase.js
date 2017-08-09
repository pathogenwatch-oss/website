const Collection = require('models/collection');

module.exports = function () {
  return (
    Collection.aggregate([
      { $match: { public: true, showcase: true, binned: false } },
      { $project: { uuid: 1, title: 1, size: 1, organismId: 1 } },
      { $lookup: { from: 'collectiongenomes', foreignField: '_collection', localField: '_id', as: 'genomes' } },
      { $project: { uuid: 1, title: 1, size: 1, organismId: 1, 'genomes.position': 1 } },
      { $unwind: '$genomes' },
      { $match: { 'genomes.position.latitude': { $exists: true }, 'genomes.position.longitude': { $exists: true } } },
      { $group: { _id: { lat: '$genomes.position.latitude', lon: '$genomes.position.longitude', uuid: '$uuid', title: '$title', organismId: '$organismId', size: '$size' } } },
      { $group: { _id: { uuid: '$_id.uuid', title: '$_id.title', organismId: '$_id.organismId', size: '$_id.size' }, locations: { $push: { lat: '$_id.lat', lon: '$_id.lon' } } } },
      { $project: { uuid: '$_id.uuid', title: '$_id.title', organismId: '$_id.organismId', size: '$_id.size', locations: 1, _id: 0 } },
    ])
  );
};
