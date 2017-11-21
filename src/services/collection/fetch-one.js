const services = require('services');
const Analysis = require('models/analysis');

const projections = {
  core: {
    'results.fp.subTypeAssignment': 1,
    'results.coreSummary': 1,
  },
  mlst: {
    'results.st': 1,
    'results.alleles': 1,
  },
  paarsnp: {
    'results.antibiotics': 1,
    'results.paar': 1,
    'results.snp': 1,
  },
};

function addGenomes(collection) {
  if (collection.status !== 'READY') {
    return collection;
  }

  const { analysis, genomes } = collection;
  const tasknames = Object.keys(analysis);
  return Promise.all(
    tasknames.map(task =>
      Analysis.find(
        { fileId: { $in: genomes.map(_ => _.fileId) }, task, version: analysis[task] },
        Object.assign({ fileId: 1, task: 1 }, projections[task] || { results: 1 })
      )
    )
  ).then(analyses => {
    const analysisByFileId = {};
    for (let i = 0; i < tasknames.length; i++) {
      for (const doc of analyses[i]) {
        const memo = analysisByFileId[doc.fileId] || [];
        memo.push(doc);
        analysisByFileId[doc.fileId] = memo;
      }
    }
    for (const genome of genomes) {
      genome.analysis = {};
      for (const { task, results } of analysisByFileId[genome.fileId]) {
        genome.analysis[task] = results;
      }
    }
    return collection;
  });
}

module.exports = ({ user, uuid }) =>
  services.request('collection', 'fetch-progress', { user, uuid })
    .then(collection => collection.ensureAccess(user))
    .then(collection => {
      if (collection.status === 'READY') {
        return (
          collection
            .populate('_organism')
            .execPopulate()
            .then(_ => addGenomes(_.toObject()))
        );
      }
      return collection;
    });
