const naturalSort = require('natural-sort');

const mainStorage = require('services/storage')('main');

const LOGGER = require('utils/logging').createLogger('PAARSNP model');
const { PAARSNP_LIBRARY } = require('utils/documentKeys');

function createPaarColumns({ resistanceSets }) {
  return resistanceSets.reduce((memo, { agents, elementIds }) => {
    for (const { antibioticKey } of agents) {
      const elements = (memo[antibioticKey] || []);
      memo[antibioticKey] = Array.from(new Set(elements.concat(elementIds))).sort(naturalSort());
    }
    return memo;
  }, {});
}

function createSnpColumns({ resistanceSets }) {
  return Object.keys(resistanceSets).reduce(
    (memo, key) => {
      const { agents, elementIds } = resistanceSets[key];
      for (const { antibioticKey } of agents) {
        for (const element of elementIds) {
          const genes = (memo[antibioticKey] || {});
          const dividingIndex = element.lastIndexOf('_');
          const gene = element.slice(0, dividingIndex);
          const snp = element.slice(dividingIndex + 1);
          genes[gene] = (genes[gene] || []).concat(snp).sort(naturalSort());
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
