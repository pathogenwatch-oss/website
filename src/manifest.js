const tasks = require('../tasks.json');

const config = require('configuration');

function getImageName(task, version) {
  return `registry.gitlab.com/cgps/wgsa-tasks/${task}:${version}`;
}

module.exports.getImageName = getImageName;

module.exports.getImages = function () {
  const imageNames = new Set();
  for (const subtasks of Object.values(tasks)) {
    for (const task of subtasks) {
      imageNames.add(getImageName(task.task, task.version));
    }
  }
  return Array.from(imageNames);
};

module.exports.getTasks = function () {
  const allTasks = [];
  for (const subtasks of Object.values(tasks)) {
    for (const task of subtasks) {
      allTasks.push(task);
    }
  }
  return allTasks;
};

module.exports.getSpeciatorTask = function () {
  const { speciation = {} } = config.tasks || {};
  const { task = 'speciator', version = 'v1' } = speciation;
  return { task, version };
};

module.exports.getTreesTask = function () {
  const { trees = {} } = config.tasks || {};
  const { task = 'tree', version = 'v1', requires = [ 'core' ] } = trees;
  return { task, version, requires };
};

const collectionIgnore = new Set(
  config.tasks ? config.tasks.collectionIgnore : undefined
);

module.exports.getTasksByOrganism = function (organismId, speciesId, genusId, collectionId) {
  const taskLists = [ tasks.all ];

  if (organismId in tasks) taskLists.push(tasks[organismId]);
  if (speciesId in tasks) taskLists.push(tasks[speciesId]);
  if (genusId in tasks) taskLists.push(tasks[genusId]);

  const uniqueTasks = [];
  const keys = new Set();
  for (const taskList of taskLists) {
    for (const task of taskList) {
      if (collectionId && collectionIgnore.has(task.task)) continue;
      const taskKey = task.task + task.version;
      if (!keys.has(taskKey)) {
        keys.add(taskKey);
        uniqueTasks.push(task);
      }
    }
  }

  return uniqueTasks;
};
