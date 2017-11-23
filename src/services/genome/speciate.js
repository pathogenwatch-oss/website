const Analysis = require('../../models/analysis');
const Genome = require('../../models/genome');

const { request } = require('services');
const { getSpeciatorTask, getTasksByOrganism } = require('../../manifest');

function jumpQueue({ genomeId, fileId, uploadedAt, clientId }, doc) {
  const { organismId, speciesId, genusId } = doc.results;
  const tasks = getTasksByOrganism(organismId, speciesId, genusId);
  return Analysis.find({
    fileId,
    $or: tasks,
  })
  .lean()
  .then(cachedResults =>
    Genome.addAnalysisResults(genomeId, doc, ...cachedResults)
      .then(() => {
        const existingTasks = new Set(cachedResults.map(_ => _.task));
        const missingTasks = tasks.filter(_ => !existingTasks.has(_.task));
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

module.exports = function (message) {
  const { genomeId, fileId, uploadedAt, clientId } = message;
  const speciatorTask = getSpeciatorTask();
  const { task, version, timeout = defaultTimeout } = speciatorTask;

  return Analysis.findOne({ fileId, task, version })
    .lean()
    .then(doc => {
      if (doc) {
        return jumpQueue(message, doc);
      }
      return request('tasks', 'run', { genomeId, fileId, task, version, timeout$: timeout * 1000 });
    });
};
