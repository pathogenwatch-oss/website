import saureus from './saureus';
import salty from './salty';
import neigo from './neigo';
// import lismn from './lismn';
// import salen from './salen';

const definitions = {
  saureus,
  salty,
  neigo,
  // lismn,
  // salen,
};

const definitionsAsList = Object.keys(definitions).map(key => definitions[key]);

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
