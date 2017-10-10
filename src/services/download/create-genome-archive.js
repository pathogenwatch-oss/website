const fastaStorage = require('wgsa-fasta-store');
const { fastaStoragePath } = require('configuration');

const { ServiceRequestError } = require('utils/errors');
const { createFastaFileName } = require('services/utils');

module.exports = ({ genomes }) => {
  if (!genomes || !genomes.length) throw new ServiceRequestError('Missing Ids');

  const files = genomes.map(({ name, fileId }) =>
    ({ name: createFastaFileName(name), id: fileId }));

  return (
    fastaStorage.archive(fastaStoragePath, files)
  );
};
