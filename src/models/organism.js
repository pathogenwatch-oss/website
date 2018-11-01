const mongoose = require('mongoose');
const { Schema } = mongoose;

const { getCollectionSchemes } = require('manifest');
const { setToObjectOptions } = require('./utils');

const schema = new Schema({
  taxId: { type: String, required: true, index: true },
  name: String,
  shortName: String,
  deployed: { type: Date },
  tree: String,
  references: [ {
    name: String,
    uuid: String,
  } ],
  resistance: {
    antibiotics: Schema.Types.Mixed,
    paar: Schema.Types.Mixed,
    snp: Schema.Types.Mixed,
  },
});

setToObjectOptions(schema);

schema.statics.getLatest = function (taxId, projection = {}) {
  return (
    this.
      find({ taxId }, projection).
      sort({ deployed: -1 }).
      limit(1).
      then(([ doc ]) => doc)
  );
};

schema.statics.deployedOrganismIds = function (user) {
  const schemes = new Set(getCollectionSchemes(user));
  return this.distinct('taxId')
    .then(taxIds => taxIds.filter(taxId => schemes.has(taxId)));
};

module.exports = mongoose.model('Organism', schema);
