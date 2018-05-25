const { request } = require('services');
const { ServiceRequestError } = require('utils/errors');

module.exports = async ({ user, sessionID, id }) => {
  if (!id) throw new ServiceRequestError('Missing Id');

  const projection = {
    'analysis.cgmlst.scheme': 1,
  };
  const genome = await request('genome', 'authorise', { user, sessionID, id, projection });

  if (genome && genome.analysis && genome.analysis.cgmlst) {
    const { scheme } = genome.analysis.cgmlst;
    return await request('clustering', 'fetch', { user, sessionID, scheme, genomeId: id });
  }
  return null;
};
