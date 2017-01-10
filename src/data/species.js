const mongoose = require('mongoose');
const { Schema } = mongoose;

const CollectionGenome = require('data/CollectionGenome').schema;
const mainStorage = require('services/storage')('main');
const { ANTIMICROBIAL_MASTER, ANTIMICROBIAL_SPECIES, PAARSNP_LIBRARY } =
  require('utils/documentKeys');

const schema = new Schema({
  taxId: { type: Number, required: true },
  name: String,
  shortName: String,
  deployed: { type: Date },
  tree: String,
  references: [ CollectionGenome ],
  resistance: {
    antibiotics: Schema.Types.Mixed,
    paar: Schema.Types.Mixed,
    snp: Schema.Types.Mixed,
  },
});

schema.methods.addReferences = function (genomes) {

};

function fetchAntibiotics(taxId) {
  return mainStorage.retrieveMany([
    ANTIMICROBIAL_MASTER,
    `${ANTIMICROBIAL_SPECIES}_${taxId}`,
  ]).
  then(console.log);
}

function fetchPaarsnpLibrary(taxId) {
  return mainStorage.retrieve(`${PAARSNP_LIBRARY}_${taxId}`).
    then(console.log);
}

schema.methods.completeDeployment = function (taxId, tree) {
  Promise.all([
    fetchAntibiotics(taxId),
    fetchPaarsnpLibrary(taxId),
  ]).then(([ antibiotics, { paar, snp } ]) =>
    this.update({
      taxId,
      tree,
      resistance: { antibiotics, paar, snp },
      deployed: new Date(),
    })
  );
};

module.exports = mongoose.model('Species', schema);
