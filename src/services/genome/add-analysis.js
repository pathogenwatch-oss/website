const { request } = require('services/bus');

const Genome = require('models/genome');

module.exports = function ({ genomeId, task, version, result, props, clientId }) {
  const update = Object.assign({ __v: version }, result);
  return (
    Genome.update({ _id: genomeId }, { [`analysis.${task}`]: update })
      .then(() => {
        if (clientId) {
          request('notification', 'send', {
            channel: clientId,
            topic: 'analysis',
            message: { id: genomeId, task, result: update, props },
          });
        }
      })
  );
};
