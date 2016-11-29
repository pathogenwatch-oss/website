const systemMetadataColumns = [
  'assemblyId', 'uuid', 'speciesId', 'fileId', 'collectionId', 'pmid',
  'filename', 'assemblyName', 'displayname',
  'date', 'year', 'month', 'day',
  'position', 'latitude', 'longitude',
];

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
    date: metadata.date || {
      year: metadata.year,
      month: metadata.month,
      day: metadata.day,
    },
    position: metadata.position || {
      latitude: metadata.latitude,
      longitude: metadata.longitude,
    },
    pmid: metadata.pmid,
    userDefined: filterUserDefinedColumns(metadata),
    metrics,
  };
}

module.exports = {
  createRecord,
};
