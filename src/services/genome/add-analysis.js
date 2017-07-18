const { request } = require('services/bus');

const Genome = require('models/genome');

module.exports = ({ genomeId, task, version, result, clientId }) =>
  Genome.update({ _id: genomeId }, { [`analysis.${task}`]: Object.assign({ __v: version }, result) })
    .then(() => {
      if (clientId) {
        request('notification', 'send', {
          channel: clientId,
          topic: 'analysis',
          message: { id: genomeId, task, version, result },
        });
      }
    });
