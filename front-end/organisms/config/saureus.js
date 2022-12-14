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
      <strong>{formattedName}</strong> is a Gram-positive microorganism. While the nasal colonisation by <em>Staphylococcus aureus</em> is fairly widespread and occurs asymptomatically, <em>Staphylococcus aureus</em> can also transform into a pathogen causing a diverse infections ranging from mild skin infections to life-threatening conditions. <em>Staphylococcus aureus</em> in its methicillin-sensitive (MSSA) form but especially in its methicillin-resistant (MRSA) or even multi-resistant form are threatening the community and healthcare system worldwide and it has reached the status of being one of the most common causative agents for infectious disease.
    </p>
  ),
  taxonomy: [
    { taxId: 131567, scientificName: 'Cellular organisms', rank: 'no rank' },
    { taxId: 2, scientificName: 'Bacteria', rank: 'superkingdom' },
    { taxId: 1783272, scientificName: 'Terrabacteria group', rank: 'no rank' },
    { taxId: 1239, scientificName: 'Firmicutes', rank: 'phylum' },
    { taxId: 91061, scientificName: 'Bacilli', rank: 'class' },
    { taxId: 1385, scientificName: 'Bacillales', rank: 'order' },
    { taxId: 90964, scientificName: 'Staphylococcaceae', rank: 'family' },
    { taxId: 1279, scientificName: 'Staphylococcus', rank: 'genus' },
    { taxId: 1280, scientificName: 'Staphylococcus aureus', rank: 'species' },
  ],
  maxGenomeSize: 3.5 * Math.pow(10, 6),
  gcRange: {
    min: 31,
    max: 35,
  },
  uiOptions: {
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
