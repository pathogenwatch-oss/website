const { request } = require('services');
const { ServiceRequestError } = require('utils/errors');

module.exports = async ({ user, id }) => {
  if (!id) throw new ServiceRequestError('Missing Id');

  const projection = {
    'analysis.cgmlst.scheme': 1,
    'analysis.speciator.organismId': 1,
  };
  const genome = await request('genome', 'authorise', { user, id, projection });

  if (genome && genome.analysis && genome.analysis.cgmlst && genome.analysis.speciator) {
    const { scheme } = genome.analysis.cgmlst;
    const { organismId } = genome.analysis.speciator;
    return request('clustering', 'fetch', { user, scheme, organismId, id });
  }
  return null;
};
