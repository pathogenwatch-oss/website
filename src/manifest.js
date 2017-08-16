const tasks = require('../tasks.json');

const config = require('configuration');
const { specieator } = config.tasks || {};
const specieatorTask = 'specieator';

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

module.exports.getSpecieatorTask = function () {
  const { version = 'v1' } = specieator;
  return { task: specieatorTask, version };
};

module.exports.getTasksByOrganism = function (organismId, speciesId, genusId) {
  const taskLists = [];

  if (organismId in tasks) taskLists.push(tasks[organismId]);
  if (speciesId in tasks) taskLists.push(tasks[speciesId]);
  if (genusId in tasks) taskLists.push(tasks[genusId]);

  const uniqueTasks = [ ...tasks.all ];
  const keys = new Set();
  for (const taskList of taskLists) {
    for (const task of taskList) {
      const taskKey = task.name + task.version;
      if (!keys.has(taskKey)) {
        keys.add(taskKey);
        uniqueTasks.push(task);
      }
    }
  }

  return uniqueTasks;
};
