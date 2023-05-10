const Genome = require('models/genome');
const Queue = require('models/queue');

const { state, now } = Queue;

const { taskTypes, getClusteringTask } = require('manifest');

function getJobStatus(doc) {
  if (!doc) return 'NOT_QUEUED';
  if (doc.rejectionReason) return 'FAILED';
  return 'QUEUED';
}

module.exports = async function ({ taskId, user, genomeId, projection = {} }) {
  let scheme;
  let spec;
  let organismId;
  const queueQuery = {
    'message.spec.taskType': taskTypes.clustering,
  };
  if (taskId) {
    queueQuery['message.metadata.taskId'] = taskId;
  } else {
    scheme = await Genome.lookupCgMlstScheme(genomeId, user);
    const organism = await Genome.lookupOrganism(genomeId, user);
    organismId = organism.organismId;
    spec = getClusteringTask(scheme);
    queueQuery['message.spec.task'] = spec.task;
    queueQuery['message.metadata.scheme'] = scheme;
    queueQuery['message.metadata.organismId'] = organismId;
  }

  if (user) {
    queueQuery['message.metadata.userId'] = user._id;
  } else {
    queueQuery['message.metadata.public'] = true;
  }

  queueQuery.state = { $in: [state.PENDING, state.RUNNING] };
  // queueQuery.$or = [{ nextReceivableTime: { $gt: now() + 10 } }, { nextReceivableTime: null }];

  const doc = await Queue.findOne(queueQuery, projection).lean();
  const status = getJobStatus(doc);

  return { doc, status, scheme, organismId, spec };
};
