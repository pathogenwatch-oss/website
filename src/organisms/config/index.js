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

let currentOrganism = {};

export function getOrganismName(taxId, fallback) {
  if (taxIdMap.has(taxId)) {
    return taxIdMap.get(taxId).name;
  }
  return fallback;
}

export FormattedName from './FormattedName.react';

export default {

  get list() {
    return definitionsAsList;
  },

  get current() {
    return currentOrganism;
  },

  set current(taxId) {
    currentOrganism = taxIdMap.get(taxId) || {};
  },

  get(nickname) {
    return definitions[nickname];
  },

  get id() {
    return currentOrganism.id;
  },

  get formattedName() {
    return currentOrganism.formattedName;
  },

  get nickname() {
    return currentOrganism.nickname;
  },

  get uiOptions() {
    return currentOrganism.uiOptions || {};
  },

  get maxGenomeSize() {
    return currentOrganism.maxGenomeSize || Math.pow(10, 10);
  },

  get gcRange() {
    return currentOrganism.gcRange || {};
  },

};
