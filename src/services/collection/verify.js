const Genome = require('models/genome');
const { ServiceRequestError, ServiceRequestErrorJSON } = require('utils/errors');

const { maxCollectionSize = 1000 } = require('configuration');
const manifest = require('../../manifest');
const organismConfigs = require('../../../universal/organisms');

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
  // Should be unnecessary as is set the middleware function.

  const config = organismConfigs.find(({ id }) => id === organismId);
  const systemMaxSize = 'maxCollectionSize' in config ? config.maxCollectionSize : maxCollectionSize;
  const maxSize = user.limits && user.limits.maxCollectionSize && user.limits.maxCollectionSize[organismId] || user.limits && user.limits.maxCollectionSize && user.limits.maxCollectionSize.default || systemMaxSize;
  if (maxSize !== null && size > maxSize) {
    throw new ServiceRequestErrorJSON(`Too many assemblies provided - the maximum collection size for this organism is ${maxSize}. Please reduce the size of your selection and try again.`, {
      status: 'ERROR',
    });
  }

  const completeGenomesQuery = {};
  const erroredGenomesQuery = {};
  for (const dependency of task.requires) {
    completeGenomesQuery[`analysis.${dependency.task}`] = { $exists: true };
    erroredGenomesQuery[`analysis.${dependency.task}`] = false;
  }

  const [ complete, errors ] = await Promise.all([
    Genome.count({
      _id: { $in: genomeIds },
      'analysis.speciator.organismId': organismId,
      // 'analysis.core': { $exists: true },
      ...completeGenomesQuery,
    }),
    Genome.count({
      _id: { $in: genomeIds },
      'analysis.speciator.organismId': organismId,
      // 'analysis.core': false,
      ...erroredGenomesQuery,
    }),
  ]);

  if (errors > 0) {
    throw new ServiceRequestErrorJSON(`${task.requires.map((x) => x.task)} results failed. Please resubmit your genomes to try again.`, {
      status: 'ERROR',
    });
  }

  if (complete !== size) {
    throw new ServiceRequestErrorJSON(`${task.requires.map((x) => x.task)} results pending`, {
      status: 'NOT_READY',
      pending: size - complete,
    });
  }

  return { ok: 1 };
};
