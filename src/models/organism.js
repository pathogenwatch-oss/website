const mongoose = require('mongoose');
const { Schema } = mongoose;

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

schema.statics.deployedOrganismIds = function (user = { flags: {} }) {
  return this.distinct('taxId')
    .then(taxIds =>
      taxIds.filter(taxId => {
        if (taxId === '573' && (!user || !user.showEsblCpeExperiment)) return false;
        if (taxId === '498019' && (!user || !user.showCandidaExperiment)) return false;
        return true;
      })
    );
};

module.exports = mongoose.model('Organism', schema);
