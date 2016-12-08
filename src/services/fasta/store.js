const fastaStorage = require('wgsa-fasta-store');
const processFasta = require('wgsa-fasta-store/fasta-processor');
const { fastaStoragePath } = require('configuration');
fastaStorage.setup(fastaStoragePath);

const Fasta = require('data/fasta');

const { ServiceRequestError } = require('utils/errors');

function getFastaDocument({ fileId, filePath }) {
  return Fasta.findOne({ fileId }).
    then(fasta => {
      if (fasta) return fasta;
      return processFasta(filePath).then(
        ({ metrics, specieator: { taxId, scientificName } }) =>
          Fasta.create({
            fileId,
            speciesId: taxId,
            speciesName: scientificName,
            metrics,
          })
      );
    });
}

module.exports = ({ stream }) => {
  if (!stream) {
    return Promise.reject(new ServiceRequestError('No stream provided'));
  }

  return (
    fastaStorage.store(fastaStoragePath, stream).then(getFastaDocument)
  );
};
