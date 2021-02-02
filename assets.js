module.exports = function () {
  const assets = require('./assets.json');
  const scripts = [];
  const stylesheets = [];

  const {
    ['runtime.js']: runtime,
    ['vendor.js']: vendor,
    ['vendor.css']: vendorStyles,
    ['main.js']: main,
    ['main.css']: mainStyles,
  } = assets;

  // script order is important
  scripts.push(runtime);
  scripts.push(vendor);
  scripts.push(main);

  stylesheets.push(vendorStyles);
  stylesheets.push(mainStyles);

  return { scripts, stylesheets };
};
