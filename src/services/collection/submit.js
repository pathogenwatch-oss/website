const mapLimit = require('promise-map-limit');

const { request } = require('services/bus');

module.exports = ({ organismId, collectionId, collectionGenomes, uploadedAt }) => {
  mapLimit(collectionGenomes, 10, genome => {
    const { fileId, analysis } = genome;
    const { speciesId, genusId } = analysis.speciator;
    return request('tasks', 'submit-genome', {
      genomeId: genome._id,
      collectionId,
      fileId,
      uploadedAt,
      organismId,
      speciesId,
      genusId,
    });
  });
};
