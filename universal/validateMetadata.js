module.exports = function validateMetadata(row) {
  const {
    name = '',
    year = null,
    month = null,
    day = null,
    latitude = null,
    longitude = null,
    pmid = '',
    ...userDefined } = row; // Node errors if the final key has a comma ¯\_(ツ)_/¯

  let error;

  if (name && typeof name !== 'string') {
    error = 'name is wrong type';
  } else if (name && name.length > 256) {
    error = 'name is too long';
  } else if (pmid && typeof pmid !== 'string') {
    error = 'pmid is wrong type';
  } else if (pmid && pmid.length > 16) {
    error = 'pmid is too long';
  } else if (isNaN(latitude) || typeof latitude === 'object') {
    error = 'latitude is not a number';
  } else if (isNaN(longitude) || typeof longitude === 'object') {
    error = 'longitude is not a number';
  } else if (isNaN(year) || typeof year === 'object') {
    error = 'year is not a number';
  } else if (isNaN(month) || typeof month === 'object') {
    error = 'month is not a number';
  } else if (isNaN(day) || typeof day === 'object') {
    error = 'day is not a number';
  } else if (Object.keys(userDefined).length > 64) {
    error = 'more than 64 user-defined columns';
  } else {
    for (const [ key, value ] of Object.entries(userDefined)) {
      if (typeof value === 'object') {
        error = 'user-defined value is wrong type';
        break;
      }
      if (value.length > 256) {
        error = 'user-defined value is too long';
        break;
      }
      if (key.length > 256) {
        error = 'user-defined column heading is too long';
        break;
      }
    }
  }

  if (error) {
    throw new Error(`Invalid metadata: ${error}`);
  }
};
