const { register } = require('services/bus');

const role = 'collection';

register(role, 'create', require('./create'));
register(role, 'fetch', require('./fetch'));
register(role, 'record-progress', require('./record-progress'));
