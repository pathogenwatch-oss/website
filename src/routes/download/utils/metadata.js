module.exports.transformer = function (doc) {
  const result = {
    id: doc._id.toString(),
    displayname: doc.name,
    latitude: doc.latitude,
    longitude: doc.longitude,
    day: doc.day,
    month: doc.month,
    year: doc.year,
    literaturelink: doc.literatureLink.value,
  };

  if (doc.userDefined) {
    for (const [ key, value ] of Object.entries(doc.userDefined)) {
      result[key] = value;
    }
  }

  return result;
};

module.exports.standardColumns = [
  'id',
  'displayname',
  'latitude',
  'longitude',
  'day',
  'month',
  'year',
  'literaturelink',
];
