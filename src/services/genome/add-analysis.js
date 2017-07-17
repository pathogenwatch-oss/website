const { request } = require('services/bus');

const Genome = require('models/genome');

module.exports = ({ genomeId, task, result, clientId }) =>
  Genome.update({ _id: genomeId }, { [`analysis.${task}`]: result })
    .then(() => {
      if (clientId) {
        request('notification', 'send', {
          channel: clientId,
          topic: 'analysis',
          message: { id: genomeId, task, result },
        });
      }
    });
