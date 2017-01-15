import sortBy from 'lodash.sortby';

const supportedSpecies = require('../../universal/species');

const supportedSpeciesIds = new Set(supportedSpecies.map(_ => _.id));

export const isSupported = ({ speciesId }) => supportedSpeciesIds.has(speciesId);

const definitions =
  supportedSpecies.reduce((memo, { id, nickname }) => {
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

export const referenceCollections = sortBy(
  definitionsAsList.reduce((memo, { id, nickname, collections }) => {
    if (!collections) return memo;
    return memo.concat(collections.map(_ => ({
      link: `/${nickname}/collection/${_.id}`,
      species: id,
      title: _.author,
      description: _.title,
      pubmedLink: `http://www.ncbi.nlm.nih.gov/pubmed/${_.pmid}`,
      size: _.numberOfGenomes,
    })));
  }, []),
  [ 'title' ]
);

let currentSpecies = {};

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

  get maxGenomeSize() {
    return currentSpecies.maxGenomeSize || Math.pow(10, 10);
  },

  get gcRange() {
    return currentSpecies.gcRange || {};
  },

};
