const Genome = require('models/genome');

module.exports = function (props) {
  return (
    Genome
      .find(
        Genome.getFilterQuery(props),
        { name: 1,
          uploadedAt: 1,
          pending: 1,
          errored: 1,
          'analysis.speciator.organismId': 1,
          'analysis.speciator.organismName': 1,
          'analysis.mlst.st': 1,
          'analysis.speciator.__v': 1,
          'analysis.mlst.__v': 1,
          'analysis.cgmlst.__v': 1,
          'analysis.core.__v': 1,
          'analysis.paarsnp.__v': 1,
          'analysis.metrics.__v': 1,
          'analysis.ngmast.__v': 1,
          'analysis.genotyphi.__v': 1,
        },
      )
      .lean()
      .then(genomes => genomes.map(genome => {
        const { analysis = {} } = genome;
        const { mlst = {}, speciator = {} } = analysis;
        genome.id = genome._id;
        genome._id = undefined;
        genome.st = mlst.st;
        genome.organismId = speciator.organismId;
        genome.organismName = speciator.organismName;
        for (const task of Object.keys(analysis)) {
          analysis[task] = analysis[task].__v;
        }
        return genome;
      }))
  );
};
