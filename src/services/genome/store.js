const fastaStorage = require('wgsa-fasta-store');
const processFasta = require('wgsa-fasta-store/fasta-processor');
const { fastaStoragePath } = require('configuration');
fastaStorage.setup(fastaStoragePath);

const GenomeFile = require('models/genomeFile');

const { ServiceRequestError } = require('utils/errors');

function getGenomeFileDocument({ fileId, filePath }) {
  return GenomeFile.findOne({ fileId }).
    then(fasta => {
      if (fasta) return fasta;
      return processFasta(filePath).then(
        ({ metrics, specieator: { speciesTaxId, scientificName } }) =>
          GenomeFile.create({
            fileId,
            organismId: speciesTaxId,
            organismName: scientificName,
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
    fastaStorage.store(fastaStoragePath, stream).then(getGenomeFileDocument)
  );
};
