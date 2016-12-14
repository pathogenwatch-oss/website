const { register } = require('services/bus');

const role = 'download';
register(role, 'create-genome-archive', require('./create-genome-archive'));
register(role, 'genome-archive-path', require('./genome-archive-path'));
