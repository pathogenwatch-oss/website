const { request } = require('services');
const { ServiceRequestError } = require('utils/errors');

module.exports = async ({ user, query }) => {
  const { id, threshold } = query;
  if (!id) throw new ServiceRequestError('Missing Id');

  const projection = {
    'analysis.cgmlst.scheme': 1,
  };
  const genome = await request('genome', 'authorise', { user, id, projection });

  const filters = query;
  delete filters.id;
  delete filters.threshold;

  if (genome && genome.analysis && genome.analysis.cgmlst) {
    const { scheme, version } = genome.analysis.cgmlst;
    return request('clustering', 'fetch-linked-genomes', { user, scheme, version, id, threshold, filters });
  }
  return null;
};
