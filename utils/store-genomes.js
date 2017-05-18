const { request } = require('services');
const Genome = require('models/genome');

function createGenome(metadata, getGenomeFile, options) {
  return (
    getGenomeFile(metadata)
      .then(stream =>
        request('genome', 'create', Object.assign({ stream, metadata }, options))
          .then(({ id }) =>
            request('genome', 'edit', Object.assign({ id, metadata }, options))
              .then(() => Genome.findById(id).populate('_file'))
          )
      )
  );
}

module.exports = function (genomes, getGenomeFile, options, LOGGER) {
  return genomes.reduce(
    (memo, row, i) =>
      memo.then(previous =>
        createGenome(row, getGenomeFile, options)
          .then(genome => {
            previous.push([ row.uuid, genome ]);
            if (LOGGER) LOGGER.info(`Genome ${i + 1} of ${genomes.length}`);
            return previous;
          })
        ),
    Promise.resolve([])
  );
};
