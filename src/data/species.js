const mongoose = require('mongoose');
const { Schema } = mongoose;

const CollectionGenome = require('data/collectionGenome');
const mainStorage = require('services/storage')('main');
const { ANTIMICROBIAL_MASTER, ANTIMICROBIAL_SPECIES, PAARSNP_LIBRARY } =
  require('utils/documentKeys');

const { setToObjectOptions } = require('./utils');

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

setToObjectOptions(schema);

function fetchAntibiotics(taxId) {
  return mainStorage.retrieveMany([
    ANTIMICROBIAL_MASTER,
    `${ANTIMICROBIAL_SPECIES}_${taxId}`,
  ]).
  then(({ results }) => {
    const master = results[ANTIMICROBIAL_MASTER].antimicrobials;
    const { antibiotics } = results[`${ANTIMICROBIAL_SPECIES}_${taxId}`];

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

schema.statics.deploy = function (collection) {
  const taxId = collection.speciesId;
  return Promise.all([
    fetchAntibiotics(taxId),
    fetchPaarsnpLibrary(taxId),
    CollectionGenome.remove({ _collection: collection }),
  ]).then(([ antibiotics, { paar, snp }, references ]) =>
    Promise.all([
      this.create({
        deployed: new Date(),
        references,
        resistance: { antibiotics, paar, snp },
        taxId,
        tree: collection.tree,
      }),
      collection.remove(),
    ])
  );
};

module.exports = mongoose.model('Species', schema);
