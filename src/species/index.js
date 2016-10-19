const definitions =
  require('../../universal/species').reduce((memo, { id, nickname }) => {
    memo[nickname] = {
      id,
      nickname,
      ...require(`./${nickname}`).default,
    };
    return memo;
  }, {});

const definitionsAsList = Object.keys(definitions).map(key => definitions[key]);

export const taxIdMap = new Map(
  definitionsAsList.map(({ id, ...species }) => [ id, species ])
);

export const referenceCollections =
  definitionsAsList.reduce((memo, { id, nickname, collections }) => {
    if (!collections) return memo;
    return memo.concat(collections.map(_ => ({
      link: `/${nickname}/collection/${_.id}`,
      species: id,
      title: _.author,
      description: _.title,
      pubmedLink: `http://www.ncbi.nlm.nih.gov/pubmed/${_.pmid}`,
    })));
  }, []);

let currentSpecies = {};

export const isSupported = ({ speciesId }) => !!speciesId; // cast to boolean

export default {

  get list() {
    return definitionsAsList;
  },

  get current() {
    return currentSpecies;
  },

  set current(nickname) {
    currentSpecies = definitions[nickname];
  },

  get(nickname) {
    return definitions[nickname];
  },

  get id() {
    return currentSpecies.id;
  },

  get formattedName() {
    return currentSpecies.formattedName;
  },

  get nickname() {
    return currentSpecies.nickname;
  },

  get uiOptions() {
    return currentSpecies.uiOptions || {};
  },

  get maxAssemblySize() {
    return currentSpecies.maxAssemblySize || Math.pow(10, 10);
  },

  get gcRange() {
    return currentSpecies.gcRange || {};
  },

};
