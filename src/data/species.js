const mongoose = require('mongoose');
const { Schema } = mongoose;

const CollectionGenome = require('data/collectionGenome');
const mainStorage = require('services/storage')('main');
const { ANTIMICROBIAL_MASTER, ANTIMICROBIAL_SPECIES, PAARSNP_LIBRARY } =
  require('utils/documentKeys');

const schema = new Schema({
  taxId: { type: Number, required: true },
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

schema.statics.addAnalysisResult = function (taxId, uuid, name, result) {
  return this.update(
    { taxId, 'references.uuid': uuid },
    { [`references.$.analysis.${name.toLowerCase()}`]: result }
  );
};

schema.methods.addReferences = function (genomes) {
  this.references = genomes.map(genome => CollectionGenome.convert(genome));
  return this.save();
};

function fetchAntibiotics(taxId) {
  return mainStorage.retrieveMany([
    ANTIMICROBIAL_MASTER,
    `${ANTIMICROBIAL_SPECIES}_${taxId}`,
  ]).
  then(({ results }) => {
    const master = results[ANTIMICROBIAL_MASTER];
    const { antibiotics } = results[ANTIMICROBIAL_SPECIES];

    return antibiotics.map(({ antibioticKey }) => ({
      name: antibioticKey,
      longName: master.find(_ => _.key === antibioticKey).fullName,
    }));
  });
}

function fetchPaarsnpLibrary(taxId) {
  return mainStorage.retrieve(`${PAARSNP_LIBRARY}_${taxId}`).
    then(({ paarLibrary, snpLibrary }) => ({
      paar: paarLibrary.resistanceGenes.map(_ => _.familyName),
      snp:
        Object.keys(snpLibrary.sequences).
          reduce((memo, seqId) => memo.concat(
            snpLibrary.sequences[seqId].resistanceMutations.map(_ => _.name)
          ), []),
    }));
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
