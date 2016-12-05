const { register } = require('../bus');

const role = 'backend';
const LOGGER = require('utils/logging').createLogger(`${role} service`);

register(role, 'new-collection', require('./new-collection')(LOGGER));
register(role, 'submit', require('./submit')(LOGGER));
