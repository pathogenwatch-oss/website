import React from 'react';

const definitions = {

  lismn: {
    id: '1639',
    nickname: 'lismn',
    formattedName: (<span><em>Listeria monocytogenes</em></span>),
    imagePath: '/assets/img/lismn.jpg',
    definitionText: (<span><strong><em>Listeria monocytogenes</em></strong>, a bacterium causing the infection Listeriosis.</span>),
    missingAnalyses: [ 'PAARSNP' ],
    active: true,
  },

  saureus: {
    id: '1280',
    nickname: 'saureus',
    formattedName: (<span><em>Staphylococcus aureus</em></span>),
    imagePath: '/assets/img/saureus.jpg',
    definitionText: (<span><strong><em>Staphylococcus aureus</em></strong>, a gram-positive coccal bacterium.</span>),
    active: false,
  },

  salty: {
    id: '90370',
    nickname: 'salty',
    formattedName: (<span><em>Salmonella</em> Typhi</span>),
    imagePath: '/assets/img/salty.jpg',
    definitionText: (<span><strong><em>Salmonella</em></strong> <strong>Typhi</strong>,  a common serovar of <em>Salmonella enterica</em> subsp. <em>enterica</em>.</span>),
    active: false,
  },

  salen: {
    id: '149539',
    nickname: 'salen',
    formattedName: (<span><em>Salmonella</em> Enteritidis</span>),
    imagePath: '/assets/img/salen.jpg',
    definitionText: (<span><strong><em>Salmonella</em> Enteritidis</strong>, a common serotype of <em>Salmonella enterica</em> subsp. <em>enterica</em>.</span>),
    active: false,
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
