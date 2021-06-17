const tasks = require('../tasks.json');

const config = require('configuration');

const GB = 1024 ** 3;
const defaultTimeout = config.tasks.timeout || 60;

function addTaskDefaults(task) {
  const defaultMemory = 1*GB;
  if (task.task === 'speciator') defaultMemory = 0.5*GB;
  else if (task.task === 'cgmlst') defaultMemory = 3*GB;
  else if (task.task === 'core') defaultMemory = 2*GB;
  else if (task.task === 'tree' || task.task === 'subtree') defaultMemory = 5*GB;
  else if (task.task === 'clustering') defaultMemory = 15*GB;
  task.resources = { memory: defaultMemory, cpu: 1, ...(task.resources || {})}
  task.timeout = task.timeout || defaultTimeout;
  return task;
}

function getImageName(task, version) {
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
  const { task = 'speciator', version = 'v3.0.1' } = speciation;
  return { task, version };
};

function hasFlags(task) {
  const { flags = {} } = task;
  return Object.keys(flags).length > 0;
}

const defaultUser = {
  canRun: task => !hasFlags(task),
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

  return Object.values(uniqueTasks).map(addTaskDefaults)
};

module.exports.getCollectionTask = function (organismId, task) {
  const collectionTasks = tasks.collection;

  if (organismId in collectionTasks) {
    const list = collectionTasks[organismId];
    const taskDetails = list.find(_ => _.task === task);
    return addTaskDefaults(taskDetails)
  }

  return null;
};

module.exports.getClusteringTask = function () {
  return addTaskDefaults(tasks.clustering);
};

module.exports.getCollectionSchemes = function (user = defaultUser) {
  const schemes = [];
  for (const [ taxId, collectionTasks ] of Object.entries(tasks.collection)) {
    const treeTask = collectionTasks.find(_ => _.task === 'tree');
    if (treeTask && user.canRun(treeTask)) {
      schemes.push(taxId);
    }
  }
  return schemes;
};

module.exports.organismHasTask = function (taskname, taxIds, user = defaultUser) {
  for (const taxId of taxIds) {
    if (taxId in tasks.genome) {
      const task = tasks.genome[taxId].find(_ => _.task === taskname);
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
      const task = tasks.collection[taxId].find(_ => _.task === 'subtree');
      if (task) {
        return user.canRun(task);
      }
    }
  }
  return false;
};
