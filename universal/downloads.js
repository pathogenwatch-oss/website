
function getPrettyFilename(speciesNickname, fileName) {
  return `wgsa_${speciesNickname}_${fileName}`;
}

module.exports = {
  getPrettyFilename,
};
