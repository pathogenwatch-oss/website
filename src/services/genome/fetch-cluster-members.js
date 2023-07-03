const { request } = require('services');
const { ServiceRequestError } = require('utils/errors');
const { maxContextInputSize } = require('configuration');
const { messageToken } = require("../../../universal/constants");

module.exports = async ({ user, query }) => {
  const { id, threshold } = query;
  if (!id) throw new ServiceRequestError('Missing Id');
  const idCount = [].concat(id).length;
  if (idCount > maxContextInputSize) throw new ServiceRequestError(`${messageToken} Too many genomes requested for context searching: ${idCount} (max ${maxContextInputSize})`);
  const projection = {
    'analysis.cgmlst.scheme': 1,
    'analysis.speciator.organismId': 1,
  };
  const genome = await request('genome', 'authorise', { user, id, projection });

  const filters = query;
  delete filters.id;
  delete filters.threshold;

  if (genome && genome.analysis && genome.analysis.cgmlst) {
    const { scheme } = genome.analysis.cgmlst;
    const { organismId } = genome.analysis.speciator;
    return request('clustering', 'fetch-linked-genomes', { user, scheme, organismId, id, threshold, filters });
  }
  return null;
};
