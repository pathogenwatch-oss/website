const definitions = {

  saureus: {
    id: '1280',
    nickname: 'saureus',
    name: 'Staphylococcus aureus',
  },

  salty: {
    id: '90370',
    nickname: 'salty',
    name: 'Salmonella typhimurium',
  },

};

const definitionsAsList = Object.keys(definitions).map(key => definitions[key]);

let currentSpecies = {};

export default {

  get list() {
    return definitionsAsList;
  },

  isSupported(nickname) {
    return (nickname in definitions);
  },

  set current(nickname) {
    currentSpecies = definitions[nickname];
  },

  get id() {
    return currentSpecies.id;
  },

  get name() {
    return currentSpecies.name;
  },

};
