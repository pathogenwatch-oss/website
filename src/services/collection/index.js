const { register } = require('services/bus');

const role = 'collection';

register(role, 'create', require('./create'));
register(role, 'fetch', require('./fetch'));
register(role, 'fetch-progress', require('./fetch-progress'));
