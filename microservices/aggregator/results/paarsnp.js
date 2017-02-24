const CollectionGenome = require('models/collectionGenome');
const mainStorage = require('services/storage')('main');
const { PAARSNP_RESULT } = require('utils/documentKeys');

module.exports = (taskName, { assemblyId, documentKeys }) => {
  const { uuid } = assemblyId;
  const resultDocKey = documentKeys.find(_ => _.indexOf(`${PAARSNP_RESULT}_`) === 0);
  return mainStorage.retrieve(resultDocKey).
    then(result => ({
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
        result.paarResult.paarElementIds || [] : [],
      snp: result.snparResult ?
        result.snparResult.resistanceMutationIds || [] : [],
    })).
    then(result => CollectionGenome.addAnalysisResult(uuid, taskName, result));
};
