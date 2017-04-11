const Genome = require('models/genome');

const submitGenome = require('../../../microservices/runner/submit');

function getGenomes(ids) {
  return Genome
    .find({ _id: { $in: ids } })
    .populate('_file');
}

module.exports = function (message) {
  return Promise.resolve(message.genomeIds)
    .then(getGenomes)
    .then(genomes =>
      genomes.map(submitGenome)
    );
};
