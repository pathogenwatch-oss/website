const { request } = require('services');

function createGenome(metadata, getGenomeFile, options) {
  return (
    getGenomeFile(metadata)
      .then(stream =>
        request('genome', 'create', Object.assign({ stream, metadata }, options))
          .then(({ id }) =>
            request('genome', 'edit', { id, metadata })
              .then(() => request('genome', 'fetch-one', { id }))
          )
      )
  );
}

module.exports = function (genomes, getGenomeFile, options, LOGGER) {
  return genomes.reduce(
    (memo, row, i) => {
      if (LOGGER) LOGGER.info(`Genome ${i + 1} of ${genomes.length}`);
      return memo.then(previous =>
        createGenome(row, getGenomeFile, options)
          .then(genome => {
            previous.push([ row.uuid, genome ]);
            return previous;
          })
        );
    },
    Promise.resolve([])
  );
};
