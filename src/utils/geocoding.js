const GeoJsonGeometriesLookup = require('geojson-geometries-lookup');
const geojson = require('@geo-maps/countries-maritime-5m')();
const getCountryISO2 = require('country-iso-3-to-2');

const lookup = new GeoJsonGeometriesLookup(geojson);

const colonists = new Set([ 'CHN', 'FRA', 'GBR', 'USA' ]);
function decolonise(features) {
  if (features.length > 1) {
    for (const { properties } of features) {
      const { A3 } = properties;
      if (colonists.has(A3)) continue;
      return A3;
    }
  }
  return features[0].properties.A3;
}

module.exports.getCountryCode = function (latitude, longitude) {
  const point = { type: 'Point', coordinates: [ longitude, latitude ] };
  const { features } = lookup.getContainers(point);
  if (features.length) {
    const iso3 = decolonise(features);
    const iso2 = getCountryISO2(iso3);
    if (iso2) return iso2.toLowerCase();
  }
  return null;
};
