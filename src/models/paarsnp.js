const mainStorage = require('services/storage')('main');

const LOGGER = require('utils/logging').createLogger('PAARSNP model');
const { PAARSNP_LIBRARY } = require('utils/documentKeys');

function createPaarColumns({ resistanceSets }) {
  return resistanceSets.reduce((memo, { agents, elementIds }) => {
    for (const { antibioticKey } of agents) {
      const elements = (memo[antibioticKey] || []);
      memo[antibioticKey] = elements.concat(elementIds);
    }
    return memo;
  }, {});
}

function createSnpColumns({ resistanceSets }) {
  return Object.values(resistanceSets).reduce(
    (memo, { agents, elementIds }) => {
      for (const { antibioticKey } of agents) {
        for (const element of elementIds) {
          const genes = (memo[antibioticKey] || {});
          const [ gene, snp ] = element.split('_');
          const snps = (genes[gene] || []);
          genes[gene] = snps.concat(snp);
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
