const fs = require('fs');
const path = require('path');
const template = require('lodash.template');

const serverConfig = require(
  path.join(
    __dirname, // bin
    '..', // wgsa_front-end
    '..', // node_modules
    '..', // wgsa_middle-end
    'config.json'
  )
);

const bundlePath = path.join(__dirname, '..', 'public', 'wgsa.js');
const bundle = fs.readFileSync(bundlePath);

fs.writeFileSync(
  bundlePath,
  template(bundle)({
    pusherKey: serverConfig.pusher.key,
    maxCollectionSize: serverConfig.maxCollectionSize,
  })
);
