const { register } = require('services/bus');

const role = 'fasta';
register(role, 'store', require('./store'));
register(role, 'edit', require('./edit'));
