
function getFileName(speciesNickname, fileName) {
  return `pathogenwatch_${speciesNickname}_${fileName}`;
}

module.exports = {
  getFileName,
};
