const bus = require('./bus');

exports.request = bus.request;

require('./backend');
require('./collection');
require('./download');
require('./genome');
