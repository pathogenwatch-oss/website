const CollectionAssembly = require('data/collectionAssembly');
const mainStorage = require('services/storage')('main');
const { FP_RESULT } = require('utils/documentKeys');

module.exports = ({ assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${FP_RESULT}_${uuid}`).
    then(result => CollectionAssembly.update(
      { uuid }, {
        'analysis.fp': {
          subtype: result.subTypeAssignment,
        },
      }
    ));
};
