import React from 'react';

const definitions = {

  saureus: {
    id: '1280',
    nickname: 'saureus',
    formattedName: (<span><em>Staphylococcus aureus</em></span>),
    imagePath: '/assets/img/saureus.jpg',
    'definitionText': (<span><em><b>Staphylococcus aureus</b></em> is a gram-positive coccal bacterium</span>)
  },

  salty: {
    id: '90370',
    nickname: 'salty',
    formattedName: (<span><em>Salmonella</em> Typhi</span>),
    imagePath: '/assets/img/salty.jpg',
    'definitionText': (<span><em><b>Salmonella enterica</b></em> subsp. <em><b>enterica</b></em> is a subspecies of Salmonella enterica</span>)
  },

  salen: {
    id: '149539',
    nickname: 'salen',
    formattedName: (<span><em>Salmonella</em> Enteritidis</span>),
    imagePath: '/assets/img/salen.jpg',
    'definitionText': (<span><em><b>Salmonella</b></em> serotype Enteritidis (SE) is one of the most common serotypes of Salmonella bacteria</span>)
  },

  lismn: {
    id: '1639',
    nickname: 'lismn',
    formattedName: (<span><em>Listeria monocytogenes</em></span>),
    imagePath: '/assets/img/lismn.jpg',
    'definitionText': (<span><em><b>Listeria monocytogenes</b></em> is the bacterium that causes the infection listeriosis</span>)
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
