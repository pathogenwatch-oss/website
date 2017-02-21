const mongoose = require('mongoose');
const { Schema } = mongoose;

const CollectionGenome = require('models/collectionGenome');

const { setToObjectOptions } = require('./utils');

const schema = new Schema({
  taxId: { type: String, required: true },
  name: String,
  shortName: String,
  deployed: { type: Date },
  tree: String,
  references: [ CollectionGenome.schema ],
  resistance: {
    antibiotics: Schema.Types.Mixed,
    paar: Schema.Types.Mixed,
    snp: Schema.Types.Mixed,
  },
});

setToObjectOptions(schema);

schema.statics.deploy = function (collection) {
  const taxId = collection.uuid;
  const amr = require('models/amr'); // sync require to prevent loading in web-api service
  return Promise.all([
    amr.fetchAntibiotics(taxId),
    amr.fetchPaarsnpLibrary(taxId),
    CollectionGenome.find({ _collection: collection._id }),
  ]).
  then(([ antibiotics, { paar, snp }, references ]) =>
    Promise.all([
      this.create({
        deployed: new Date(),
        references,
        resistance: { antibiotics, paar, snp },
        taxId,
        tree: collection.tree,
      }),
      collection.remove(),
      CollectionGenome.remove({ _collection: collection._id }),
    ])
  ).
  then(() => collection);
};

schema.statics.getLatest = function (taxId) {
  return (
    this.
      find({ taxId }).
      sort({ deployed: -1 }).
      limit(1).
      then(([ doc ]) => doc)
  );
};

module.exports = mongoose.model('Species', schema);
