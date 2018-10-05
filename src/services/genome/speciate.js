const Analysis = require('models/analysis');
const Genome = require('models/genome');

const { request } = require('services');
const { getSpeciatorTask, getTasksByOrganism } = require('manifest');

const notify = require('services/genome/notify');
const { summariseAnalysis } = require('../../utils/analysis');

function submitTasks({ genomeId, fileId, uploadedAt, clientId }, doc) {
  const { organismId, speciesId, genusId } = summariseAnalysis(doc);
  const tasks = getTasksByOrganism(organismId, speciesId, genusId);
  return Analysis.find({
    fileId,
    $or: tasks.map(({ task, version }) => ({ task, version })),
  })
  .lean()
  .then(cachedResults =>
    Genome.addAnalysisResults(genomeId, doc, ...cachedResults)
      .then(() => {
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
        });
      })
  );
}

const config = require('configuration');
const defaultTimeout = config.tasks.timeout || 30;
const maxRetries = config.tasks.retries || 3;

const speciatorTask = getSpeciatorTask();

module.exports = function findTask(message, retries = 0) {
  const { genomeId, fileId, uploadedAt, clientId } = message.metadata;
  const { task, version, timeout = defaultTimeout } = speciatorTask;

  return Analysis.findOne({ fileId, task, version })
    .lean()
    .then(doc => {
      if (doc) {
        return submitTasks(message.metadata, doc);
      }
      const metadata = { genomeId, fileId, uploadedAt, clientId };
      return request('tasks', 'run', { task, version, timeout$: timeout * 1000, metadata })
        .then(() => {
          if (retries === maxRetries) return null;
          return findTask(message, retries + 1);
        });
    });
};
