const tasks = require('../tasks.json');

const config = require('configuration');

function getImageName(task, version) {
  return `registry.gitlab.com/cgps/wgsa-tasks/${task}:${version}`;
}

module.exports.getImageName = getImageName;

function getImages(section) {
  const imageNames = new Set();
  for (const subtasks of Object.values(section)) {
    for (const task of subtasks) {
      imageNames.add(getImageName(task.task, task.version));
    }
  }
  return Array.from(imageNames);
}

module.exports.getImages = function (sectionName) {
  if (sectionName in tasks) {
    return getImages(tasks[sectionName]);
  }
  throw new Error('Unrecognised task section.');
};

module.exports.getSpeciatorTask = function () {
  const { speciation = {} } = config.tasks || {};
  const { task = 'speciator', version = 'v1' } = speciation;
  return { task, version };
};

module.exports.getTasksByOrganism = function (organismId, speciesId, genusId) {
  const genomeTasks = tasks.genome;
  const taskLists = [ genomeTasks.all ];

  if (organismId in genomeTasks) taskLists.push(genomeTasks[organismId]);
  if (speciesId in genomeTasks) taskLists.push(genomeTasks[speciesId]);
  if (genusId in genomeTasks) taskLists.push(genomeTasks[genusId]);

  const uniqueTasks = [];
  const keys = new Set();
  for (const taskList of taskLists) {
    for (const task of taskList) {
      const taskKey = task.task + task.version;
      if (!keys.has(taskKey)) {
        keys.add(taskKey);
        uniqueTasks.push(task);
      }
    }
  }

  return uniqueTasks;
};

module.exports.getCollectionTask = function (organismId, task) {
  const collectionTasks = tasks.collection;

  if (organismId in collectionTasks) {
    const list = collectionTasks[organismId];
    return list.find(_ => _.task === task);
  }

  return null;
};
