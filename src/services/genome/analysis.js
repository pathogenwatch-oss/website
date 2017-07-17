const { request } = require('services/bus');

const Genome = require('models/genome');

module.exports = ({ genomeId, type, result, sessionID }) => {
  if (type === 'species') {
    return Genome.update({ _id: genomeId }, {
      _file: result._id,
      organismId: result.organismId,
    })
    .then(() => request('notification', 'send', {
      channel: sessionID,
      topic: 'analysis',
      message: {
        id: genomeId,
        type,
        result: {
          organismId: result.organismId,
          organismName: result.organismName,
          metrics: result.metrics,
        },
      },
    }));
  }
  return (
    Genome.update({ _id: genomeId }, { [`analysis.${type}`]: result })
      .then(() => request('notification', 'send', {
        channel: sessionID,
        topic: 'analysis',
        message: { id: genomeId, type, result },
      }))
  );
};
