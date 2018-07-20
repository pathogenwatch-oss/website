module.exports = function validateMetadata(row) {
  const {
    name = '',
    year = null,
    month = null,
    day = null,
    latitude = null,
    longitude = null,
    pmid = '',
    userDefined,
  } = row;

  let error;

  if (name && typeof name !== 'string') {
    error = 'name is wrong type';
  } else if (name && name.length > 256) {
    error = 'name is too long';
  } else if (pmid && typeof pmid !== 'string') {
    error = 'pmid is wrong type';
  } else if (pmid && pmid.length > 16) {
    error = 'pmid is too long';
  } else if (latitude !== null && (isNaN(latitude) || typeof latitude === 'object')) {
    error = 'latitude is not a number';
  } else if (longitude !== null && (isNaN(longitude) || typeof longitude === 'object')) {
    error = 'longitude is not a number';
  } else if (latitude !== null && longitude === null) {
    error = 'latitude without longitude';
  } else if (latitude === null && longitude !== null) {
    error = 'longitude without latitude';
  } else if (year !== null && (isNaN(year) || typeof year === 'object')) {
    error = 'year is not a number';
  } else if (month !== null && (isNaN(month) || typeof month === 'object')) {
    error = 'month is not a number';
  } else if (day !== null && (isNaN(day) || typeof day === 'object')) {
    error = 'day is not a number';
  } else if (day !== null && month === null) {
    error = 'day provided without month';
  } else if (day !== null && year === null) {
    error = 'day provided without year';
  } else if (month !== null && year === null) {
    error = 'month provided without year';
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
