const isScript = /\.js$/;
const isStylesheet = /\.css$/;

module.exports = function (pathToManifest) {
  const assets = require(pathToManifest);
  const scripts = [];
  const stylesheets = [];
  for (const file of Object.values(assets)) {
    if (file.test(isScript)) scripts.push(file);
    if (file.test(isStylesheet)) stylesheets.push(file);
  }
  return { scripts, stylesheets };
};
