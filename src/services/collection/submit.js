const { request } = require('services/bus');

module.exports = ({ organismId, collectionId, collectionGenomes, uploadedAt }) => {
  for (const genome of collectionGenomes) {
    const { fileId, analysis } = genome;
    const { speciesId, genusId } = analysis.speciator;
    request('tasks', 'submit-genome', { genomeId: genome._id, collectionId, fileId, uploadedAt, organismId, speciesId, genusId });
  }
};
