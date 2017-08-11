const tasks = require('../tasks.json');

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

module.exports.getTasksByOrganism = function (organismId) {
  if (organismId in tasks) {
    return tasks.all.concat(tasks[organismId]);
  }
  return tasks.all;
};
