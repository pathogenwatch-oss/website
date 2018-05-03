const Genome = require('models/genome');
const manifest = require('../../manifest');
const { ServiceRequestError, ServiceRequestErrorJSON } = require('utils/errors');

const { maxCollectionSize = { anonymous: 0, loggedIn: 0 } } = require('configuration');

function getMaxCollectionSize(user) {
  if (user) {
    return user.admin ? null : maxCollectionSize.loggedIn;
  }
  return maxCollectionSize.anonymous;
}

module.exports = async function ({ genomeIds, organismId, user }) {
  if (!organismId) {
    throw new ServiceRequestError('No organism ID provided');
  }
  if (!genomeIds || !genomeIds.length) {
    throw new ServiceRequestError('No genome IDs provided');
  }

  const task = manifest.getCollectionTask(organismId, 'tree');
  if (!task) throw new ServiceRequestError('Unsupported organism');

  const size = genomeIds.length;
  const maxSize = getMaxCollectionSize(user);
  if (maxSize && size > maxSize) {
    throw new ServiceRequestError('Too many genome IDs provided');
  }

  const [ complete, errors ] = await Promise.all([
    Genome.count({
      _id: { $in: genomeIds },
      'analysis.speciator.organismId': organismId,
      'analysis.core': { $exists: true },
    }),
    Genome.count({
      _id: { $in: genomeIds },
      'analysis.speciator.organismId': organismId,
      'analysis.core': false,
    }),
  ]);

  if (errors > 0) {
    throw new ServiceRequestErrorJSON('Core results failed', {
      status: 'ERROR',
    });
  }

  if (complete !== size) {
    throw new ServiceRequestErrorJSON('Core results pending', {
      status: 'NOT_READY',
      pending: size - complete,
    });
  }

  return { ok: 1 };
};
