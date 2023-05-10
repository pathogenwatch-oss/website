const sort = require('natsort')({ insensitive: true });

module.exports.transformer = function (doc) {
  const { __v, library = { version: '0.0.1', source: 'PUBLIC' } } = doc.analysis.paarsnp;
  return {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: __v,
    'Library Version': library.source === 'PUBLIC' ?
      library.version : `${library.source}: ${library.version}`,
    Variants: doc.analysis.paarsnp.variants.sort(sort).join(','),
    Acquired: doc.analysis.paarsnp.acquired.sort(sort).join(','),
  };
};
