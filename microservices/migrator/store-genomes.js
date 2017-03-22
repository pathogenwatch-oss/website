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

module.exports = function (genomes, getGenomeFile) {
  return genomes.reduce((memo, row) =>
    memo.then(previous =>
      createGenome(row, getGenomeFile)
        .then(genome => {
          previous.push([ row.assemblyId, genome ]);
          return previous;
        })
    ),
    Promise.resolve([])
  );
};
