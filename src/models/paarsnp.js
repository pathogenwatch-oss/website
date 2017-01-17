const sort = require('natsort')();

const mainStorage = require('services/storage')('main');

const LOGGER = require('utils/logging').createLogger('PAARSNP model');
const { PAARSNP_LIBRARY } = require('utils/documentKeys');

function createPaarColumns({ resistanceSets }) {
  return resistanceSets.reduce((memo, { agents, elementIds, effect }) => {
    for (const { antibioticKey } of agents) {
      const elements = memo[antibioticKey] || [];
      for (const element of elementIds) {
        if (elements.find(_ => _.element === element)) continue;
        elements.push({ element, effect: effect.split('_')[0] });
      }
      memo[antibioticKey] = elements.sort((a, b) => sort(a.element, b.element));
    }
    return memo;
  }, {});
}

function createSnpColumns({ resistanceSets }) {
  return Object.keys(resistanceSets).reduce(
    (memo, key) => {
      const { agents, elementIds, effect } = resistanceSets[key];
      for (const { antibioticKey } of agents) {
        for (const element of elementIds) {
          const genes = (memo[antibioticKey] || {});

          const dividingIndex = element.lastIndexOf('_');
          const gene = element.slice(0, dividingIndex);
          const snpName = element.slice(dividingIndex + 1);

          genes[gene] =
            (genes[gene] || []).
              concat({ snpName, effect: effect.split('_')[0] }).
              sort((a, b) => sort(a.snpName, b.snpName));

          memo[antibioticKey] = genes;
        }
      }
      return memo;
    }, {}
  );
}

function formatForFrontend({ paarLibrary, snpLibrary }) {
  return {
    paar: createPaarColumns(paarLibrary),
    snp: createSnpColumns(snpLibrary),
  };
}

function get(speciesId, callback) {
  LOGGER.info(`Getting PAARSNP library for species: ${speciesId}`);

  mainStorage.retrieve(`${PAARSNP_LIBRARY}_${speciesId}`, (error, result) => {
    if (error) {
      return callback(error, result);
    }

    LOGGER.info('Got the PAARSNP library');
    return callback(null, formatForFrontend(result));
  });
}

module.exports.get = get;
