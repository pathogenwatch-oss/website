const config = require('../configuration');
const { organisms = [] } = config;

function getSubspecies(taxId) {
  for (const organism of organisms) {
    if (taxId === organism.taxId || organism.subspecies.includes(taxId)) {
      return {
        taxId: organism.taxId,
        name: organism.name,
      };
    }
  }

  return null;
}

module.exports = {
  getSubspecies,
};
