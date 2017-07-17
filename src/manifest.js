const tasks = require('../tasks.json');

module.exports = function getTasksByOrganism(organismId) {
  if (organismId in tasks) {
    return tasks.all.concat(tasks[organismId]);
  }
  return tasks.all;
};
