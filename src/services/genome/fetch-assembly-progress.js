const Genome = require('models/genome');
const Queue = require('models/queue');
const { ServiceRequestError } = require('utils/errors');

module.exports = async ({ uploadedAt, userId }) => {
  if (!userId) throw new ServiceRequestError('Not authenticated');

  const genomes = await Genome.find(
    { uploadedAt, _user: userId, 'upload.type': 'reads' },
    { _id: 1, fileId: 1, assembler: 1 }
  ).lean();
  if (!genomes) throw new ServiceRequestError('Not authenticated');

  const status = {
    runningSince: [],
    running: 0,
    pending: 0,
    failed: 0,
    complete: 0,
  };

  const pending = [];
  for (const doc of genomes) {
    if (doc.fileId) status.complete += 1;
    else if ((doc.assembler || {}).error) status.failed += 1;
    else {
      pending.push(doc._id.toString());
      status.pending += 1;
    }
  }

  const queued = await Queue.find({ 'message.spec.task': 'assembly', 'message.metadata.genomeId': { $in: pending } }, { state: 1, startTime: 1 }).lean();
  for (const job of queued) {
    if (job.state === Queue.state.RUNNING) {
      status.running += 1;
      status.pending -= 1;
      status.runningSince.push(Math.floor(job.startTime / 1000));
    }
  }

  return status;
};
