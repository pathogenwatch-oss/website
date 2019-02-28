const countryIso = require('country-iso');
const getCountryISO2 = require('country-iso-3-to-2');

module.exports.getCountryCode = function (latitude, longitude) {
  const iso3 = countryIso.get(latitude, longitude);
  return getCountryISO2(iso3);
};
