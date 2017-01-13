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

    return antibiotics.reduce((memo, { antibioticKey }) => {
      const am = master.find(_ => _.key === antibioticKey);
      if (!am) return memo;
      const { key, antimicrobialClass, fullName } = am;
      memo.push({ key, antimicrobialClass, fullName });
      return memo;
    }, []);
  });
}

function createPaarColumns({ resistanceSets }) {
  return resistanceSets.reduce((memo, { agents, elementIds }) => {
    for (const { antibioticKey } of agents) {
      const elements = (memo[antibioticKey] || []);
      memo[antibioticKey] = elements.concat(elementIds);
    }
    return memo;
  }, {});
}

function createSnpColumns({ resistanceSets }) {
  return Object.keys(resistanceSets).reduce(
    (memo, key) => {
      const { agents, elementIds } = resistanceSets[key];
      for (const { antibioticKey } of agents) {
        for (const element of elementIds) {
          const genes = (memo[antibioticKey] || {});
          const dividingIndex = element.lastIndexOf('_');
          const gene = element.slice(0, dividingIndex);
          const snp = element.slice(dividingIndex + 1);
          genes[gene] = (genes[gene] || []).concat(snp);
          memo[antibioticKey] = genes;
        }
      }
      return memo;
    }, {}
  );
}

function fetchPaarsnpLibrary(taxId) {
  return mainStorage.retrieve(`${PAARSNP_LIBRARY}_${taxId}`).
    then(({ paarLibrary, snpLibrary }) => ({
      paar: createPaarColumns(paarLibrary),
      snp: createSnpColumns(snpLibrary),
    }));
}

schema.statics.deploy = function (collection) {
  const taxId = collection.uuid;
  return Promise.all([
    fetchAntibiotics(taxId),
    fetchPaarsnpLibrary(taxId),
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

module.exports = mongoose.model('Species', schema);
