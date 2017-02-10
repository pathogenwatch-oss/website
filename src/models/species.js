const mongoose = require('mongoose');
const { Schema } = mongoose;
const sort = require('natsort')();

const CollectionGenome = require('models/collectionGenome');
const mainStorage = require('services/storage')('main');
const { ANTIMICROBIAL_MASTER, ANTIMICROBIAL_SPECIES, PAARSNP_LIBRARY } =
  require('utils/documentKeys');

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
  return resistanceSets.reduce((memo, { agents, elementIds, effect }) => {
    for (const { antibioticKey } of agents) {
      const elements = memo[antibioticKey] || [];
      for (const element of elementIds) {
        if (elements.find(_ => _.element === element)) continue;
        elements.push({ element, effect: effect.split('_')[0] });
      }
      memo[antibioticKey] = elements.sort((a, b) => sort(a.element, b.element));
    }
    return memo;
  }, {});
}

function createSnpColumns({ resistanceSets }) {
  return Object.keys(resistanceSets).reduce(
    (memo, key) => {
      const { agents, elementIds, effect } = resistanceSets[key];
      for (const { antibioticKey } of agents) {
        for (const element of elementIds) {
          const genes = (memo[antibioticKey] || {});

          const dividingIndex = element.lastIndexOf('_');
          const gene = element.slice(0, dividingIndex);
          const snpName = element.slice(dividingIndex + 1);

          genes[gene] =
            (genes[gene] || []).
              concat({ snpName, effect: effect.split('_')[0] }).
              sort((a, b) => sort(a.snpName, b.snpName));

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
