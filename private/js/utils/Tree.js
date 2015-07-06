function extractIdsFromNewick(newickString) {
  var ASSEMBLY_ID_REGEX = /[a-z0-9-]{36}/igm;

  return newickString.match(ASSEMBLY_ID_REGEX);
}

module.exports = {
  extractIdsFromNewick: extractIdsFromNewick
};
