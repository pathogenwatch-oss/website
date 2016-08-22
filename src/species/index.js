import saureus from './saureus';
import salty from './salty';
// import lismn from './lismn';
// import salen from './salen';

const definitions = {
  saureus,
  salty,
  // lismn,
  // salen,
};

const definitionsAsList = Object.keys(definitions).map(key => definitions[key]);

export const taxIdMap = new Map(
  definitionsAsList.map(({ id, ...species }) => [ id, species ])
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

  get id() {
    return currentSpecies.id;
  },

  get formattedName() {
    return currentSpecies.formattedName;
  },

  get nickname() {
    return currentSpecies.nickname;
  },

  get missingAnalyses() {
    return currentSpecies.missingAnalyses || [];
  },

  get maxAssemblySize() {
    return currentSpecies.maxAssemblySize || Math.pow(10, 10);
  },

  get gcRange() {
    return currentSpecies.gcRange || {};
  },

};
