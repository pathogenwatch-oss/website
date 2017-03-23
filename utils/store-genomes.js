const { request } = require('services');

function createGenome(metadata, getGenomeFile) {
  return (
    getGenomeFile(metadata)
      .then(stream =>
        request('genome', 'create', { stream, metadata })
          .then(({ id }) =>
            request('genome', 'edit', { id, metadata })
              .then(() => request('genome', 'fetch-one', { id }))
          )
      )
  );
}

module.exports = function (genomes, getGenomeFile, LOGGER) {
  return genomes.reduce(
    (memo, row, i) => {
      if (LOGGER) LOGGER.info(`Genome ${i + 1} of ${genomes.length}`);
      return memo.then(previous =>
        createGenome(row, getGenomeFile)
          .then(genome => {
            previous.push([ row.uuid, genome ]);
            return previous;
          })
        );
    },
    Promise.resolve([])
  );
};
