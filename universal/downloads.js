
function getFileName(speciesNickname, fileName) {
  return `wgsa_${speciesNickname}_${fileName}`;
}

module.exports = {
  getFileName,
};
