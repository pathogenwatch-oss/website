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
  const maxSize = user.limits && user.limits.maxCollectionSize || maxCollectionSize;
  if (maxSize !== null && size > maxSize) {
    throw new ServiceRequestError('Too many genome IDs provided');
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
    throw new ServiceRequestErrorJSON(`${task.requires.map((x) => x.task)} results failed`, {
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
