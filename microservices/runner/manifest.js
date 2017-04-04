const services = require('services.json');

function getServicesByOrganism(organismId) {
  return services.filter(_ => _.organismId === organismId);
}

module.exports = getServicesByOrganism;
