module.exports = function validateMetadata(row) {
  const {
    name = '',
    year = null,
    month = null,
    day = null,
    latitude = null,
    longitude = null,
    pmid = '',
    ...userDefined } = row; // Node errors if there is a comma at the end of list

  let error;

  if (name && name.length > 256) {
    error = 'name is too long';
  } else if (pmid && pmid.length > 16) {
    error = 'pmid is too long';
  } else if (Object.keys(userDefined).length > 64) {
    error = 'more than 64 user-defined columns';
  } else if (
    Object.entries(userDefined)
      .some(([ key, value ]) => key.length > 256 || value.length > 256)
  ) {
    error = 'user-defined key or value too long';
  } else if (isNaN(latitude) || isNaN(longitude)) {
    error = 'latitude or longitude is not a number';
  } else if (isNaN(year) || isNaN(month) || isNaN(day)) {
    error = 'year/month/day is not a number';
  }

  if (error) {
    throw new Error(`Invalid metadata: ${error}`);
  }
};
