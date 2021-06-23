const { ServiceRequestError } = require('utils/errors');
const { createFastaFileName } = require('services/utils');
const fastaStorage = require('../../utils/fasta-store');

module.exports = ({ genomes }) => {
  if (!genomes || !genomes.length) throw new ServiceRequestError('Missing Ids');

  const files = genomes.map(({ name, fileId }) =>
    ({ name: createFastaFileName(name), fileId }));

  return fastaStorage.archive(files);
};
