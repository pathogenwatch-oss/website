const CollectionAssembly = require('data/collectionAssembly');
const mainStorage = require('services/storage')('main');
const { GENOTYPHI_RESULT } = require('utils/documentKeys');

module.exports = ({ assemblyId }) => {
  const { uuid } = assemblyId;
  return mainStorage.retrieve(`${GENOTYPHI_RESULT}_${uuid}`).
    then(result => CollectionAssembly.update(
      { uuid }, {
        'analysis.genotyphi': {
          genotype: result.genotype,
        },
      }
    ));
};
