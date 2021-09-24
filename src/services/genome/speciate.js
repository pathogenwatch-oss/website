const Genome = require('models/genome');
const User = require('models/user');
const store = require('utils/object-store');

const { request } = require('services');
const { getSpeciatorTask, getTasksByOrganism } = require('manifest');
const notify = require('services/genome/notify');
const { summariseAnalysis } = require('utils/analysis');

async function submitTasks({ genomeId, fileId, uploadedAt, clientId, userId }, doc, precache, priority) {
  const speciatorResult = summariseAnalysis(doc);
  const { organismId, speciesId, genusId, superkingdomId } = speciatorResult;
  const user = await User.findById(userId, { flags: 1 });
  const tasks = getTasksByOrganism(speciatorResult, user);

  const analysisKeys = tasks.map(({ task, version }) => store.analysisKey(task, version, fileId, organismId));
  const cachedResults = [];
  for await (const value of store.iterGet(analysisKeys)) {
    if (value === undefined) continue;
    cachedResults.push(JSON.parse(value));
  }

  await Genome.addAnalysisResults(genomeId, doc, ...cachedResults);

  const existingTasks = [ doc, ...cachedResults ];
  const existingTaskNames = new Set(cachedResults.map((_) => _.task));
  const missingTasks = tasks.filter((_) => !existingTaskNames.has(_.task));

  if (clientId && existingTasks.length > 0) {
    notify({ genomeId, clientId, uploadedAt, tasks: existingTasks });
  }

  if (missingTasks.length === 0) return undefined;

  return request('tasks', 'enqueue-genome', {
    genomeId,
    fileId,
    superkingdomId,
    organismId,
    speciesId,
    genusId,
    tasks: missingTasks,
    uploadedAt,
    clientId,
    userId,
    precache,
    priority,
  });
}

const config = require('configuration');

const defaultTimeout = config.tasks.timeout || 30;
const maxRetries = config.tasks.retries || 3;

const speciatorTask = getSpeciatorTask();

module.exports = async function findTask(message, retries = 0) {
  const { genomeId, fileId, uploadedAt, clientId } = message.metadata;
  const { task, version, timeout = defaultTimeout } = speciatorTask;

  const value = await store.getAnalysis(task, version, fileId, undefined);
  const doc = value === undefined ? undefined : JSON.parse(value);
  const { precache = false, priority = 0 } = message;
  if (doc) {
    return submitTasks(message.metadata, doc, precache, priority);
  }

  const metadata = { genomeId, fileId, uploadedAt, clientId };
  await request('tasks', 'run', { spec: speciatorTask, timeout$: timeout * 1000 * 1.05, metadata, precache });

  if (retries === maxRetries) return null;
  return findTask(message, retries + 1);
};
