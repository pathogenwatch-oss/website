const services = require('../../services.json');

module.exports = function getServicesByOrganism(organismId) {
  console.log(services, organismId);
  console.log(services.filter(_ => _.organismId === organismId));
  return services.filter(_ => _.organismId === organismId);
};
