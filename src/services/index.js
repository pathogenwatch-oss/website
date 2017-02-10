const fs = require('fs');
const path = require('path');

const bus = require('./bus');

exports.request = bus.request;

fs.readdirSync(__dirname).
  filter(file => /\.js$/.test(file) === false).
  forEach(role =>
    fs.readdirSync(path.join(__dirname, role)).
      map(_ => _.replace('.js', '')).
      forEach(action =>
        bus.register(role, action, require(`./${role}/${action}`))
      )
  );
