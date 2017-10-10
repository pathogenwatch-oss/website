const { request } = require('services/bus');

module.exports = ({ organismId, collectionId, uuidToGenome, uploadedAt }) => {
  request('backend', 'submit', { organismId, collectionId, uuidToGenome });
  for (const [ genomeId, genome ] of uuidToGenome) {
    const { fileId, analysis } = genome;
    const { speciesId, genusId } = analysis.speciator;
    request('tasks', 'submit-genome', { genomeId, collectionId, fileId, uploadedAt, organismId, speciesId, genusId });
  }
};
