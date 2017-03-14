const supportedOrganisms = require('../../../universal/organisms');

const supportedOrganismsIds = new Set(supportedOrganisms.map(_ => _.id));

export const isSupported = ({ organismId }) => supportedOrganismsIds.has(organismId);

const definitions =
  supportedOrganisms.reduce((memo, { id, nickname }) => {
    memo[nickname] = {
      id,
      nickname,
      ...require(`./${nickname}`).default,
    };
    return memo;
  }, {});

const definitionsAsList = Object.keys(definitions).map(key => definitions[key]);

export const taxIdMap = new Map(
  definitionsAsList.map(organism => [ organism.id, organism ])
);

let currentOrganisms = {};

export FormattedName from './FormattedName.react';

export default {

  get list() {
    return definitionsAsList;
  },

  get current() {
    return currentOrganisms;
  },

  set current(taxId) {
    currentOrganisms = taxIdMap.get(taxId);
  },

  get(nickname) {
    return definitions[nickname];
  },

  get id() {
    return currentOrganisms.id;
  },

  get formattedName() {
    return currentOrganisms.formattedName;
  },

  get nickname() {
    return currentOrganisms.nickname;
  },

  get uiOptions() {
    return currentOrganisms.uiOptions || {};
  },

  get maxGenomeSize() {
    return currentOrganisms.maxGenomeSize || Math.pow(10, 10);
  },

  get gcRange() {
    return currentOrganisms.gcRange || {};
  },

};
