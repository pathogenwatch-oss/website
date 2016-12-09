const { register } = require('services/bus');

const role = 'genome';
register(role, 'create', require('./create'));
register(role, 'edit', require('./edit'));
register(role, 'get', require('./get'));
register(role, 'store', require('./store'));
