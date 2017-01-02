const centroids = require('geocoding/centroids.json');

export function getCountryName(code) {
  if (code) {
    const [ name ] = centroids[code.toLowerCase()];
    return name || code;
  }
  return code;
}

export function getCountryCentroid(code) {
  if (code) {
    const [ name, lat, lng ] = centroids[code.toLowerCase()];
    if (name) {
      return [ lat, lng ];
    }
  }
  return code;
}
