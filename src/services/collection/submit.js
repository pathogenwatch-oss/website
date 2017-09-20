const { request } = require('services/bus');

module.exports = ({ organismId, collectionId, uuidToGenome }) => {
  request('backend', 'submit', { organismId, collectionId, uuidToGenome });
  for (const [ genomeId, genome ] of uuidToGenome) {
    const { fileId, uploadedAt, analysis } = genome;
    const { speciesId, genusId } = analysis.speciator;
    request('tasks', 'submit-genome', { genomeId, collectionId, fileId, uploadedAt, organismId, speciesId, genusId });
  }
};
