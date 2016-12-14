const CollectionGenome = require('data/collectionGenome');
const mainStorage = require('services/storage')('main');
const { NGMAST_RESULT } = require('utils/documentKeys');

module.exports = (name, { assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${NGMAST_RESULT}_${uuid}`).
    then(result => ({
      ngmast: result.ngmast,
      por: result.por,
      tbpb: result.tbpb,
    })).
    then(result => CollectionGenome.addAnalysisResult(uuid, name, result));
};
