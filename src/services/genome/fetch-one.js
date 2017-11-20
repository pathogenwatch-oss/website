const Analysis = require('models/analysis');
const { ServiceRequestError, NotFoundError } = require('utils/errors');
const { request } = require('services');

const taskNames = [
  'speciator', 'metrics', 'mlst', 'paarsnp', 'genotyphi', 'ngmast',
];

module.exports = ({ user, sessionID, id }) => {
  if (!id) throw new ServiceRequestError('Missing Id');

  return request('genome', 'authorise', { user, sessionID, id })
    .then(genome => {
      if (!genome) throw new NotFoundError('Not found or access denied');
      return Analysis.find({
        fileId: genome.fileId,
        task: { $in: taskNames },
      }, { _id: 0, fileId: 0, __v: 0, 'results.matches': 0 })
      .then(tasks => Object.assign(genome, { tasks }));
    });
};
