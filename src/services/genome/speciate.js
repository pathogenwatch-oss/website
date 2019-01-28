const Analysis = require('models/analysis');
const Genome = require('models/genome');
const User = require('models/user');

const { request } = require('services');
const { getSpeciatorTask, getTasksByOrganism } = require('manifest');

const notify = require('services/genome/notify');
const { summariseAnalysis } = require('../../utils/analysis');

async function submitTasks({ genomeId, fileId, uploadedAt, clientId, userId }, doc) {
  const { organismId, speciesId, genusId } = summariseAnalysis(doc);
  const user = await User.findById(userId, { flags: 1 });
  const tasks = getTasksByOrganism(organismId, speciesId, genusId, user);
  const cachedResults = await Analysis.find({
    fileId,
    $or: tasks.map(({ task, version }) => ({ task, version })),
  }).lean();

  await Genome.addAnalysisResults(genomeId, doc, ...cachedResults);

  const existingTasks = [ doc, ...cachedResults ];
  const existingTasknames = new Set(cachedResults.map(_ => _.task));
  const missingTasks = tasks.filter(_ => !existingTasknames.has(_.task));

  if (clientId && existingTasks.length > 0) {
    notify({ genomeId, clientId, uploadedAt, tasks: existingTasks });
  }

  if (missingTasks.length === 0) return Promise.resolve();

  return request('tasks', 'enqueue-genome', {
    genomeId,
    fileId,
    organismId,
    speciesId,
    genusId,
    tasks: missingTasks,
    uploadedAt,
    clientId,
    userId,
  });
}

const config = require('configuration');
const defaultTimeout = config.tasks.timeout || 30;
const maxRetries = config.tasks.retries || 3;

const speciatorTask = getSpeciatorTask();

module.exports = async function findTask(message, retries = 0) {
  const { genomeId, fileId, uploadedAt, clientId } = message.metadata;
  const { task, version, timeout = defaultTimeout } = speciatorTask;

  const doc = await Analysis.findOne({ fileId, task, version }).lean();

  if (doc) {
    return submitTasks(message.metadata, doc);
  }

  const metadata = { genomeId, fileId, uploadedAt, clientId };
  await request('tasks', 'run', { task, version, timeout$: timeout * 1000, metadata });

  if (retries === maxRetries) return null;
  return findTask(message, retries + 1);
};
