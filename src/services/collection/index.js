const { register } = require('services/bus');

const role = 'collection';

register(role, 'create', require('./create'));
register(role, 'fetch', require('./fetch'));
register(role, 'fetch-list', require('./fetch-list'));
register(role, 'fetch-progress', require('./fetch-progress'));
register(role, 'subtree', require('./subtree'));
register(role, 'progress-error', require('./progress-error'));
