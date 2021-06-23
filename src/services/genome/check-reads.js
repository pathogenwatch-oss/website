const fastaStorage = require('../../utils/fasta-store')

module.exports = ({ genomeId }) => {
  return fastaStorage.countReads(genomeId);
};
