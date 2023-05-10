module.exports.transformer = function (doc) {
  if (!doc.analysis.paarsnp) {
    return {
      'Genome ID': doc._id.toString(),
      'Genome Name': doc.name,
    };
  }
  const { __v, library = { version: '0.0.1', source: 'PUBLIC' } } = doc.analysis.paarsnp;
  const result = {
    'Genome ID': doc._id.toString(),
    'Genome Name': doc.name,
    Version: __v,
    'Library Version': library.source === 'PUBLIC' ? library.version : `${library.source}: ${library.version}`,
  };
  for (const { state, agent } of doc.analysis.paarsnp.resistanceProfile) {
    result[agent.name] = state;
  }
  return result;
};
