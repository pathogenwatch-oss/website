const { getSubspecies } = require('./organisms');

function summariseAnalysis(analysis) {
  const { task, version, results } = analysis;

  if (task === 'speciator') {
    const { taxId, ...rest } = results;
    const subspecies = getSubspecies(taxId);
    if (subspecies !== null) {
      return {
        __v: version,
        ...rest,
        organismId: subspecies.taxId,
        organismName: subspecies.name,
      };
    }
    return {
      __v: version,
      ...rest,
      organismId: results.speciesId,
      organismName: results.speciesName,
    };
  }

  // core and cgmlst documents are big so don't store them all on the genome record
  if (task === 'core') {
    const { fp = {}, summary: coreSummary = {} } = results;
    return { __v: version, fp, summary: coreSummary };
  }

  if (task === 'cgmlst') {
    const { st, scheme, source } = results;
    return { __v: version, st, scheme, source };
  }

  return { __v: version, ...results };
}

module.exports = {
  summariseAnalysis,
};
