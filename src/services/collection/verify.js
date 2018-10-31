const Genome = require('models/genome');
const manifest = require('../../manifest');
const { ServiceRequestError, ServiceRequestErrorJSON } = require('utils/errors');

const { maxCollectionSize = 1000 } = require('configuration');

module.exports = async function ({ genomeIds, organismId, user }) {
  if (!user) {
    throw new ServiceRequestError('Not authenticated');
  }
  if (!organismId) {
    throw new ServiceRequestError('No organism ID provided');
  }
  if (!genomeIds || !genomeIds.length) {
    throw new ServiceRequestError('No genome IDs provided');
  }

  const schemes = manifest.getCollectionSchemes(user);
  if (!schemes.includes(organismId)) {
    throw new ServiceRequestError('Unsupported organism');
  }

  const task = manifest.getCollectionTask(organismId, 'tree');
  if (!task) throw new ServiceRequestError('Unsupported organism');

  const size = genomeIds.length;
  const maxSize = user.admin ? null : maxCollectionSize;
  if (maxSize !== null && size > maxSize) {
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
