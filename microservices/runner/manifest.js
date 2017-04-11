const services = require('../../services.json');

module.exports = function getServicesByOrganism(organismId) {
  return services.filter(_ => _.organismId === organismId);
};
