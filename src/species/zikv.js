import React from 'react';

const name = 'Zika virus';
const formattedName = (<em>{name}</em>);
const shortName = 'Zika';
const formattedShortName = (<em>{shortName}</em>);


export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  maxGenomeSize: 15 * Math.pow(10, 3),
  publicMetadataColumnNames: [],
  uiOptions: {
    noPopulation: true,
    noMLST: true,
    noAMR: true,
  },
};
