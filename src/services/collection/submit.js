const { request } = require('services/bus');

module.exports = ({ organismId, collectionId, uuidToGenome }) =>
  Promise.all([
    request('backend', 'submit', { organismId, collectionId, uuidToGenome }),
    new Promise(resolve => {
      for (const [ , genome ] of uuidToGenome) {
        const genomeId = genome._id;
        const { fileId, uploadedAt, analysis } = genome;
        const { speciesId, genusId } = analysis.speciator;
        request('tasks', 'submit-genome', { genomeId, fileId, uploadedAt, organismId, speciesId, genusId });
      }
      resolve();
    }),
  ]);
