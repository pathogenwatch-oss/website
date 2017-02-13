const sort = require('natsort')();

const mainStorage = require('services/storage')('main');
const { ANTIMICROBIAL_MASTER, ANTIMICROBIAL_SPECIES, PAARSNP_LIBRARY } =
  require('utils/documentKeys');

function fetchAntibiotics(taxId) {
  return mainStorage.retrieveMany([
    ANTIMICROBIAL_MASTER,
    `${ANTIMICROBIAL_SPECIES}_${taxId}`,
  ]).
  then(({ results }) => {
    const master = results[ANTIMICROBIAL_MASTER].antimicrobials;
    const { antibiotics } = results[`${ANTIMICROBIAL_SPECIES}_${taxId}`];

    return antibiotics.reduce((memo, { antibioticKey }) => {
      const am = master.find(_ => _.key === antibioticKey);
      if (!am) return memo;
      const { key, antimicrobialClass, fullName } = am;
      memo.push({ key, antimicrobialClass, fullName });
      return memo;
    }, []);
  });
}

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

function fetchPaarsnpLibrary(taxId) {
  return mainStorage.retrieve(`${PAARSNP_LIBRARY}_${taxId}`).
    then(({ paarLibrary, snpLibrary }) => ({
      paar: createPaarColumns(paarLibrary),
      snp: createSnpColumns(snpLibrary),
    }));
}

module.exports.fetchAntibiotics = fetchAntibiotics;
module.exports.fetchPaarsnpLibrary = fetchPaarsnpLibrary;
