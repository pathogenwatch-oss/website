const mongoose = require('mongoose');
const { Schema } = mongoose;

const geocoding = require('geocoding');

const schema = new Schema({
  _file: { type: Schema.Types.ObjectId, ref: 'GenomeFile' },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  year: Number,
  month: Number,
  day: Number,
  latitude: String,
  longitude: String,
  country: String,
  pmid: String,
  userDefined: Object,
  analysis: Array,
  public: { type: Boolean, default: false },
});

function getCountryCode(latitude, longitude) {
  if (latitude && longitude) {
    return geocoding.getCountryCode(
      Number.parseFloat(latitude),
      Number.parseFloat(longitude)
    );
  }
  return null;
}

schema.statics.updateMetadata = function (_id, _user, metadata) {
  const { name, year, month, day, latitude, longitude, pmid, userDefined } = metadata;
  const country = getCountryCode(latitude, longitude);
  return this.update({ _id, _user }, {
    name,
    year,
    month,
    day,
    latitude,
    longitude,
    country,
    pmid,
    userDefined,
  }).then(({ nModified }) => ({ nModified, country }));
};

module.exports = mongoose.model('Genome', schema);
