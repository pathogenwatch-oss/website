const { getCountry } = require('country-reverse-geocoding');
const iso31661Codes = require('geo-data/iso-3166-1.json');

const systemMetadataColumns = [
  'assemblyId', 'uuid', 'speciesId', 'fileId', 'collectionId', 'pmid',
  'filename', 'assemblyName', 'displayname',
  'date', 'year', 'month', 'day',
  'position', 'latitude', 'longitude',
];

function getCountryCode({ latitude, longitude }) {
  if (latitude && longitude) {
    const country =
      getCountry(Number.parseFloat(latitude), Number.parseFloat(longitude));
    if (country.code && iso31661Codes[country.code]) {
      return iso31661Codes[country.code].toLowerCase();
    }
  }
  return null;
}

function filterUserDefinedColumns(metadata) {
  return Object.keys(metadata).reduce((memo, key) => {
    if (systemMetadataColumns.indexOf(key) === -1) {
      memo[key] = metadata[key];
    }
    return memo;
  }, {});
}

function createRecord(ids, metadata, metrics) {
  return {
    assemblyId: ids.assemblyId,
    speciesId: ids.speciesId,
    collectionId: ids.collectionId,
    fileId: ids.fileId,
    assemblyName: metadata.assemblyName,
    date: {
      year: metadata.year,
      month: metadata.month,
      day: metadata.day,
    },
    position: {
      latitude: metadata.latitude,
      longitude: metadata.longitude,
      country: getCountryCode(metadata),
    },
    pmid: metadata.pmid,
    userDefined: filterUserDefinedColumns(metadata),
    metrics,
  };
}

module.exports = {
  createRecord,
  getCountryCode,
};
