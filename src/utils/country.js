const centroids = require('geo-data/centroids.json');

export function getCountryInfo(code) {
  if (code) {
    const [ name ] = centroids[code.toLowerCase()];
    if (name) {
      return { code, name };
    }
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
