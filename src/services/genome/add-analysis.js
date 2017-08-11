const { request } = require('services/bus');

const Genome = require('models/genome');

const formatters = {
  paarsnp: result => ({
    antibiotics: result.antibioticProfiles ?
      result.antibioticProfiles.reduce(
        (memo, { agent, resistanceState, resistanceSets }) => {
          memo[agent.name] = {
            state: resistanceState,
            mechanisms: resistanceSets.map(_ => _.resistanceSetName),
          };
          return memo;
        }, {}
      ) : {},
    paar: result.paarResult ?
      result.paarResult.paarElementIds || [] : [],
    snp: result.snparResult ?
      result.snparResult.resistanceMutationIds || [] : [],
  }),
};

function formatResult(task, version, result) {
  const format = formatters[task];
  return Object.assign(
    { __v: version },
    format ? format(result, version) : result
  );
}

module.exports = function ({ genomeId, task, version, result, props, clientId }) {
  const update = formatResult(task, version, result);
  return (
    Genome.addAnalysisResult(genomeId, task, update)
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
