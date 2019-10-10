module.exports = function () {
  const assets = require('./assets.json');
  const scripts = [];
  const stylesheets = [];

  const {
    ['runtime.js']: runtime,
    ['vendor.js']: vendor,
    ['main.js']: main,
    ['main.css']: styles,
  } = assets;

  // script order is important
  scripts.push(runtime);
  scripts.push(vendor);
  scripts.push(main);

  stylesheets.push(styles);

  return { scripts, stylesheets };
};
