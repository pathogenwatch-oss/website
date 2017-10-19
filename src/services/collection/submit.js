const mapLimit = require('promise-map-limit');

const { request } = require('services/bus');

module.exports = ({ organismId, collectionId, uuidToGenome, uploadedAt }) => {
  request('backend', 'submit', { organismId, collectionId, uuidToGenome });
  mapLimit(uuidToGenome, 10, ([ genomeId, genome ]) => {
    const { fileId, analysis } = genome;
    const { speciesId, genusId } = analysis.speciator;
    return request('tasks', 'submit-genome', {
      genomeId,
      collectionId,
      fileId,
      uploadedAt,
      organismId,
      speciesId,
      genusId,
    });
  });
};
