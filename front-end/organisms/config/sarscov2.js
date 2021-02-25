import React from 'react';

const name = 'SARS-CoV-2';
const formattedName = (<em>{name}</em>);
const shortName = 'SARS-CoV-2';
const formattedShortName = (<em>{shortName}</em>);

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  desc: (
    <p>
      <strong>SARS-CoV-2</strong>.
    </p>
  ),
  taxonomy: [
  ],
  maxGenomeSize: 15000,
  publicMetadataColumnNames: [],
  uiOptions: {
    noPopulation: true,
  },
};
