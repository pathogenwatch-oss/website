function summariseAnalysis(analysis) {
  const { task, version, results } = analysis;

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
