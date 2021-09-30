const path = require('path');
const User = require('models/user');

const ASSEMBLY_FILE_EXTENSIONS = [
  '.fa',
  '.fas',
  '.fna',
  '.ffn',
  '.faa',
  '.frn',
  '.fasta',
  '.genome',
  '.contig',
  '.dna',
];

const taskPriorities = {
  assembly: 0,
  collection: 5,
  clustering: 5,
  genome: 0,
};

module.exports.createFastaFileName = function (genomeName = 'file') {
  const ext = path.extname(genomeName);
  if (ASSEMBLY_FILE_EXTENSIONS.includes(ext)) {
    return `${path.basename(genomeName, ext)}.fasta`;
  }
  return `${genomeName}.fasta`;
};

module.exports.getNotificationResult = function ({ task, results }) {
  switch (task) {
    case 'speciator':
      return results;
    case 'mlst':
      return {
        st: results.st,
      };
    default:
      return null;
  }
};

module.exports.getTaskPriority = async function (taskType, userId) {
  const typePriority = taskType in taskPriorities ? taskPriorities[taskType] : 0;
  const userData = await User.findById(
    userId,
    { priorityModifier: 1, _id: 0 }
  ).lean();
  const modifier = userData !== null && 'priorityModifier' in userData ? userData.priorityModifier : 0;
  return typePriority + modifier;
};
