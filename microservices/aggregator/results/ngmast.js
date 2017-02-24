const CollectionGenome = require('models/collectionGenome');
const mainStorage = require('services/storage')('main');
const { NGMAST_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId, documentKeys }) => {
  const { uuid } = assemblyId;
  const resultDocKey = documentKeys.find(_ => _.indexOf(NGMAST_RESULT) === 0);
  return mainStorage.retrieve(resultDocKey).
    then(result => ({
      ngmast: result.ngmast,
      por: result.por,
      tbpb: result.tbpb,
    })).
    then(result => CollectionGenome.addAnalysisResult(uuid, 'ngmast', result));
};
