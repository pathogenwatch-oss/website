const countryIso = require('country-iso');
const getCountryISO2 = require('country-iso-3-to-2');

module.exports.getCountryCode = function (latitude, longitude) {
  const iso3 = countryIso.get(latitude, longitude);
  const iso2 = getCountryISO2(Array.isArray(iso3) ? iso3[0] : iso3);
  if (iso2) return iso2.toLowerCase();
  return null;
};
