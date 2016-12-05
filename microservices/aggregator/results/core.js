const CollectionAssembly = require('data/collectionAssembly');
const mainStorage = require('services/storage')('main');
const { CORE_RESULT } = require('utils/documentKeys');

module.exports = ({ assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${CORE_RESULT}_${uuid}`).
    then(result => CollectionAssembly.update(
      { uuid }, {
        'analysis.core': {
          size: result.kernelSize,
          percentMatched: result.percentKernelMatched,
          percentAssemblyMatched: result.percentAssemblyMatched,
        },
      }
    ));
};
