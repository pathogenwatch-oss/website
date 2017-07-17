const fastaStorage = require('wgsa-fasta-store');
const processFasta = require('wgsa-fasta-store/fasta-processor');
const { fastaStoragePath } = require('configuration');
fastaStorage.setup(fastaStoragePath);
const { request } = require('services/bus');

const GenomeFile = require('models/genomeFile');

module.exports = ({ genomeId, fileId, filePath, sessionID }) =>
  GenomeFile.findOne({ fileId })
    .then(fasta => {
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
    })
    .then(genomeFile =>
      request('genome', 'analysis', { genomeId, type: 'species', result: genomeFile, sessionID })
    );
