const mongoose = require('mongoose');
const { Schema } = mongoose;

const { setToObjectOptions } = require('./utils');

const schema = new Schema({
  taxId: { type: String, required: true },
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

schema.statics.getLatest = function (taxId) {
  return (
    this.
      find({ taxId }).
      sort({ deployed: -1 }).
      limit(1).
      then(([ doc ]) => doc)
  );
};

schema.statics.deployedOrganismIds = function () {
  return this.distinct('taxId');
};

module.exports = mongoose.model('Organism', schema);
