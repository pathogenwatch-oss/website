const CollectionAssembly = require('data/collectionAssembly');
const mainStorage = require('services/storage')('main');
const { PAARSNP_RESULT } = require('utils/documentKeys');

module.exports = ({ assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${PAARSNP_RESULT}_${uuid}`).
    then(result => CollectionAssembly.update(
      { uuid }, {
        'analysis.paarsnp': {
          antibiotics: result.antibioticProfiles ?
            result.antibioticProfiles.reduce(
              (memo, { name, resistanceState, resistanceSets }) => {
                memo[name] = {
                  name,
                  state: resistanceState,
                  mechanisms: resistanceSets.map(_ => _.resistanceSetName),
                };
                return memo;
              }, {}
            ) : {},
          paar: result.paarResult ?
            result.paarResult.paarElementIds : [],
          snp: result.snparResult ?
            result.snparResult.resistanceMutationIds : [],
        },
      }
    ));
};
