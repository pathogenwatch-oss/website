const BoundingBox = require('boundingbox');

const mongoConnection = require('utils/mongoConnection');
const Collection = require('models/collection');

mongoConnection.connect()
  .then(() =>
    Collection.aggregate(
      { $match: { public: true } },
      { $lookup: { from: 'collectiongenomes', foreignField: '_collection', localField: '_id', as: 'genomes' } }
    )
  )
  .then(collections => Promise.all(
    collections.map(collection => {
      console.log(collection.genomes.length);
      const coordinates = collection.genomes.reduce((memo, { position }) => ({
        minlat: memo.minlat ? Math.min(memo.minlat, position.latitude) : position.latitude,
        minlon: memo.minlon ? Math.min(memo.minlon, position.longitude) : position.longitude,
        maxlat: memo.maxlat ? Math.max(memo.maxlat, position.latitude) : position.latitude,
        maxlon: memo.maxlon ? Math.max(memo.maxlon, position.longitude) : position.longitude,
      }), { minlat: null, minlon: null, maxlat: null, maxlon: null });
      console.log(coordinates);
      const box = new BoundingBox(coordinates);
      const centroid = box.getCenter();
      return Collection.update({ _id: collection._id }, { $set: { centroid } });
    })
  ))
  .then(() => process.exit(0))
  .catch(error => { console.error(error); process.exit(1); });


// 6378137 * 2 = 12756274
// -2694044.4111565403

// const output = [];
//
// for (const collection of collectionPoints) {
//   const box = new boundingBox(collection.genomes);
//   output.push
// }
