import React from 'react';

const definitions = {

  saureus: {
    id: '1280',
    nickname: 'saureus',
    formattedName: (<span><em>Staphylococcus aureus</em></span>),
  },

  salty: {
    id: '90370',
    nickname: 'salty',
    formattedName: (<span><em>Salmonella</em> Typhi</span>),
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

  get formattedName() {
    return currentSpecies.formattedName;
  },

  get nickname() {
    return currentSpecies.nickname;
  },

};
