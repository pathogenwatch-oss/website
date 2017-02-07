import React from 'react';

const name = 'Staphylococcus aureus';
const formattedName = (<em>{name}</em>);
const shortName = 'S. aureus';
const formattedShortName = (<em>{shortName}</em>);

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  maxGenomeSize: 3.5 * Math.pow(10, 6),
  gcRange: {
    min: 31,
    max: 35,
  },
  publicMetadataColumnNames: [
    'ena study',
    'ena run',
    'alternative isolate id',
    'country',
    'city',
    'geo accuracy',
    'host',
    'mlst',
    'mrsa',
  ],
};
