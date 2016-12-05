const CollectionAssembly = require('data/collectionAssembly');
const mainStorage = require('services/storage')('main');
const { NGMAST_RESULT } = require('utils/documentKeys');

module.exports = ({ assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${NGMAST_RESULT}_${uuid}`).
    then(result => CollectionAssembly.update(
      { uuid }, {
        'analysis.ngmast': {
          ngmast: result.ngmast,
          por: result.por,
          tbpb: result.tbpb,
        },
      }
    ));
};
