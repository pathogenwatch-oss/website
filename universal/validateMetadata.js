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

  if (name && typeof name !== 'string') {
    error = 'name is wrong type';
  } else if (name && name.length > 256) {
    error = 'name is too long';
  } else if (pmid && typeof pmid !== 'string') {
    error = 'pmid is wrong type';
  } else if (pmid && pmid.length > 16) {
    error = 'pmid is too long';
  } else if (typeof latitude === 'object' || isNaN(latitude)) {
    error = 'latitude is not a number';
  } else if (typeof longitude === 'object' || isNaN(longitude)) {
    error = 'longitude is not a number';
  } else if (typeof year === 'object' || isNaN(year)) {
    error = 'year is not a number';
  } else if (typeof month === 'object' || isNaN(month)) {
    error = 'month is not a number';
  } else if (typeof day === 'object' || isNaN(day)) {
    error = 'day is not a number';
  } else if (Object.keys(userDefined).length > 64) {
    error = 'more than 64 user-defined columns';
  } else {
    for (const [ key, value ] of Object.entries(userDefined)) {
      if (typeof value !== 'string') {
        error = 'user-defined value is not a string';
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
