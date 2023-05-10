const CgmlstProfile = require('models/cgmlstprofile');
const Genome = require('models/genome');
const User = require('models/user');
const store = require('utils/object-store');

const { request } = require('services');
const { getTasksByOrganism } = require('manifest');
const notify = require('services/genome/notify');
const { summariseAnalysis } = require('utils/analysis');


async function fetchCachedResults(tasks, fileId, organismId) {
  const analysisKeys = tasks.map(
    ({ task, version }) => store.analysisKey(task, version, fileId, organismId)
  );
  const cachedResults = {};
  for await (const value of store.iterGet(analysisKeys)) {
    if (value === undefined) continue;
    const cachedResult = JSON.parse(value);
    cachedResults[cachedResult.task] = cachedResult;
  }
  return cachedResults;
}

async function addFollowOnTasks(cachedResults, tasks, fileId, organismId) {
  let cachedUpdate = cachedResults;
  for (const taskCheck of tasks) {
    if ('andThen' in taskCheck && taskCheck.task in cachedResults) {
      const cachedFollowOn = await fetchCachedResults(taskCheck.andThen, fileId, organismId);
      const followOnUpdate = { ...cachedUpdate, ...cachedFollowOn };
      const childResults = await addFollowOnTasks(followOnUpdate, taskCheck.andThen, fileId, organismId);
      cachedUpdate = { ...followOnUpdate, ...childResults };
    }
  }
  return cachedUpdate;
}

async function getCachedResults(tasks, fileId, organismId) {
  const cachedResults = await fetchCachedResults(Object.values(tasks), fileId, organismId);
  return await addFollowOnTasks(cachedResults, Object.values(tasks), fileId, organismId);
}

function extractMissingTasks(tasks, existingTaskNames, inputTask, inputTaskVersion) {
  return Object.values(tasks).reduce(
    (missing, task) => {
      if (!existingTaskNames.has(task.task)) {
        if (!!inputTask) {
          missing.push({ inputTask, taskType: '', inputTaskVersion, ...task });
        } else {
          missing.push(task);
        }
      } else if ('andThen' in task) {
        // eslint-disable-next-line no-param-reassign
        missing = missing.concat(extractMissingTasks(task.andThen, existingTaskNames, task.version));
      }
      return missing;
    },
    []);
}

async function submitTasks({ genomeId, fileId, uploadedAt, clientId, userId }, doc, precache, priority) {
  const speciatorResult = summariseAnalysis(doc);
  const { organismId, speciesId, genusId, superkingdomId } = speciatorResult;
  const user = await User.findById(userId, { flags: 1 });
  const tasks = getTasksByOrganism(speciatorResult, user);

  const cachedResults = await getCachedResults(tasks, fileId, organismId);

  await Genome.addAnalysisResults(genomeId, doc, ...Object.values(cachedResults));
  if ('cgmlst' in cachedResults) {
    await CgmlstProfile.upsertProfile(fileId, cachedResults.cgmlst);
  }
  const existingTasks = [ doc, ...Object.values(cachedResults) ];
  const existingTaskNames = new Set(Object.keys(cachedResults));

  const missingTasks = extractMissingTasks(tasks, existingTaskNames);

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

module.exports = async function findTask(message, retries = 0) {
  const { spec, metadata } = message;
  const { fileId } = metadata;
  const { task, version, timeout = defaultTimeout } = spec;

  const value = await store.getAnalysis(task, version, fileId, undefined);
  const doc = value === undefined ? undefined : JSON.parse(value);
  const { precache = false, priority = 0 } = message;
  if (doc) {
    return submitTasks(message.metadata, doc, precache, priority);
  }

  await request('tasks', 'run', { spec, metadata, precache, priority, timeout$: timeout * 1000 * 1.05 });

  if (retries === maxRetries) return null;
  return findTask(message, retries + 1);
};
