/* eslint-disable no-param-reassign */
const assert = require('assert').strict;

const config = require('configuration');
const tasks = require('../tasks.json');

const GB = 1024 ** 3;
const MB = 1024 ** 2;
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const defaultTimeout = config.tasks.timeout || MINUTE;

const taskTypes = {
  assembly: 'assembly',
  genome: 'genome',
  task: 'task',
  collection: 'collection',
  clustering: 'clustering',
};
module.exports.taskTypes = taskTypes;

function formatMemory(value) {
  if (Number.isFinite(value)) return Math.floor(value);
  else if (typeof value !== 'string') throw new Error(`Don't understand memory value ${value}`);
  const [ v, unit ] = value.toLowerCase().match(/^([0-9.]+)\s*([mg])?$/).slice(1, 3);
  switch (unit) {
    case undefined:
      return Math.floor(Number(v));
    case 'm':
      return Math.floor(Number(v) * MB);
    case 'g':
      return Math.floor(Number(v) * GB);
    default:
      throw new Error(`Don't understand units of memory value ${value}`);
  }
}
module.exports.formatMemory = formatMemory;

function formatTime(value) {
  if (Number.isFinite(value)) return Math.floor(value);
  else if (typeof value !== 'string') throw new Error(`Don't understand time value ${value}`);
  const [ v, unit ] = value.toLowerCase().match(/^([0-9.]+)\s*([smh])?$/).slice(1, 3);
  switch (unit) {
    case undefined:
      return Math.floor(Number(v));
    case 's':
      return Math.floor(Number(v));
    case 'm':
      return Math.floor(Number(v) * MINUTE);
    case 'h':
      return Math.floor(Number(v) * HOUR);
    default:
      throw new Error(`Don't understand units of time value ${value}`);
  }
}
module.exports.formatTime = formatTime;

function addTaskDefaults(task) {
  const { resources = {} } = task;
  resources.cpu = resources.cpu || 1;

  switch (task.task) {
    case 'assembly':
      resources.memory = resources.memory || 3 * GB;
      resources.cpu = resources.cpu || 2;
      resources.slow = resources.slow || 1;
      break;
    case 'speciator':
      resources.memory = resources.memory || GB;
      break;
    case 'cgmlst':
      resources.memory = resources.memory || 1.5 * GB;
      break;
    case 'core':
      resources.memory = resources.memory || 2 * GB;
      break;
    case 'tree':
    case 'subtree':
      resources.memory = resources.memory || 5 * GB;
      break;
    case 'clustering':
      resources.memory = resources.memory || 15 * GB;
      resources.cpu = resources.cpu || 2;
      break;
    default:
      resources.memory = resources.memory || GB;
  }
  resources.memory = formatMemory(resources.memory);

  switch (task.task) {
    case 'assembly':
      task.taskType = taskTypes.assembly;
      break;
    case 'speciator':
      task.taskType = taskTypes.genome;
      break;
    case 'tree':
    case 'subtree':
      task.taskType = taskTypes.collection;
      break;
    case 'clustering':
      task.taskType = taskTypes.clustering;
      break;
    default:
      task.taskType = taskTypes.task;
  }

  task.resources = resources;
  task.timeout = formatTime(task.timeout || defaultTimeout);
  return task;
}

function getImageName(task, version) {
  assert.ok(task, "Need task to be defined");
  assert.ok(version, "Need version to be defined");
  return `registry.gitlab.com/cgps/pathogenwatch-tasks/${task}:${version}`;
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

  speciation.task = speciation.task || 'speciator';
  speciation.version = speciation.version || 'v3.0.1';

  return addTaskDefaults(speciation);
};

module.exports.getAssemblyTask = function () {
  return addTaskDefaults(tasks.assembly);
};

function hasFlags(task) {
  const { flags = {} } = task;
  return Object.keys(flags).length > 0;
}

const defaultUser = {
  canRun: (task) => !hasFlags(task),
};

module.exports.getTasksByOrganism = function (
  { organismId, speciesId, genusId, superkingdomId },
  user = defaultUser
) {
  const genomeTasks = tasks.genome;
  const uniqueTasks = {};

  // We want to find the versions of tasks we should run
  // We want to run the version for the most specific taxid provided (e.g. species tasks trump genus tasks)
  // If there are multiple versions at the most specific level, we pick the one with an experimental flag
  // or the first one listed.
  // If there isn't a user specified, we assume they're not part of any experiments.

  for (const id of [ 'all', superkingdomId, genusId, speciesId, organismId ]) {
    if (!id) continue;
    // There is probably a better method than looping twice but it's not obvious and this seems clear
    for (const task of genomeTasks[id] || []) {
      if (!user.canRun(task)) continue;
      // We know we're using a more specific version of a task but we don't know which yet
      uniqueTasks[task.task] = undefined;
    }
    for (const task of genomeTasks[id] || []) {
      if (!user.canRun(task)) continue;
      // If there isn't already a version of a task, add one
      if (!uniqueTasks[task.task]) {
        uniqueTasks[task.task] = task;
      } else if (hasFlags(task) && !hasFlags(uniqueTasks[task.task])) {
        // There is a previous version but there is also one with a corresponding feature flag so we'll run that instead
        uniqueTasks[task.task] = task;
      }
    }
  }

  return Object.values(uniqueTasks).map(addTaskDefaults);
};

module.exports.getCollectionTask = function (organismId, task) {
  const collectionTasks = tasks.collection;

  if (organismId in collectionTasks) {
    const list = collectionTasks[organismId];
    const taskDetails = list.find((_) => _.task === task);
    if (taskDetails === undefined) return null;
    return addTaskDefaults(taskDetails);
  }

  return null;
};

module.exports.getClusteringTask = function () {
  return addTaskDefaults(tasks.clustering);
};

module.exports.getCollectionSchemes = function (user = defaultUser) {
  const schemes = [];
  for (const [ taxId, collectionTasks ] of Object.entries(tasks.collection)) {
    const treeTask = collectionTasks.find((_) => _.task === 'tree');
    if (treeTask && user.canRun(treeTask)) {
      schemes.push(taxId);
    }
  }
  return schemes;
};

module.exports.organismHasTask = function (taskname, taxIds, user = defaultUser) {
  for (const taxId of taxIds) {
    if (taxId in tasks.genome) {
      const task = tasks.genome[taxId].find((_) => _.task === taskname);
      if (task) {
        return user.canRun(task);
      }
    }
  }
  return false;
};

module.exports.organismHasPopulation = function (taxIds, user = defaultUser) {
  for (const taxId of taxIds) {
    if (taxId in tasks.collection) {
      const task = tasks.collection[taxId].find((_) => _.task === 'subtree');
      if (task) {
        return user.canRun(task);
      }
    }
  }
  return false;
};
