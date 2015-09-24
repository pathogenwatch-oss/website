import React from 'react';

const definitions = {

  saureus: {
    id: '1280',
    nickname: 'saureus',
    formattedName: (<span><em>Staphylococcus aureus</em></span>),
    imagePath: '/assets/img/saureus.jpg',
    definitionText: (<span><strong><em>Staphylococcus aureus</em></strong> is a gram-positive coccal bacterium</span>),
    active: true
  },

  salty: {
    id: '90370',
    nickname: 'salty',
    formattedName: (<span><em>Salmonella</em> Typhi</span>),
    imagePath: '/assets/img/salty.jpg',
    definitionText: (<span><strong><em>Salmonella enterica</em></strong> subsp. <strong><em>enterica</em></strong> is a subspecies of Salmonella enterica</span>),
    active: false
  },

  salen: {
    id: '149539',
    nickname: 'salen',
    formattedName: (<span><em>Salmonella</em> Enteritidis</span>),
    imagePath: '/assets/img/salen.jpg',
    definitionText: (<span><strong><em>Salmonella</em></strong> serotype Enteritidis (SE) is one of the most common serotypes of Salmonella bacteria</span>),
    active: false
  },

  lismn: {
    id: '1639',
    nickname: 'lismn',
    formattedName: (<span><em>Listeria monocytogenes</em></span>),
    imagePath: '/assets/img/lismn.jpg',
    definitionText: (<span><strong><em>Listeria monocytogenes</em></strong> is the bacterium that causes the infection listeriosis</span>),
    missingAnalyses: [ 'PAARSNP' ],
    active: true
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

  get missingAnalyses() {
    return currentSpecies.missingAnalyses || [];
  },

};
