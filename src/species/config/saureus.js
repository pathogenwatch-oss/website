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
  desc: (
    <p>
      <em>Staphylococcus aureus</em> is a Gram-positive microorganism.&nbsp;
      While the nasal colonisation by <em>Staphylococcus aureus</em> is fairly&nbsp;
      widespread and occurs asymptomatically,&nbsp;
      <em>Staphylococcus aureus</em> can also transform into a pathogen causing a diverse&nbsp;
      infections ranging from mild skin infections to life-threatening conditions.&nbsp;
      <em>Staphylococcus aureus</em> in its methicillin-sensitive (MSSA) form but&nbsp;
      especially in its methicillin-resistant (MRSA) or even multi-resistant&nbsp;
      form are threatening the community and healthcare system worldwide and&nbsp;
      it has reached the status of being one of the most common causative&nbsp;
      agents for infectious disease.
    </p>
  ),
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
