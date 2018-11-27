import React from 'react';

const name = 'Neisseria gonorrhoeae';
const formattedName = (<em>{name}</em>);

const shortName = 'N. gonorrhoeae';
const formattedShortName = (<em>{shortName}</em>);

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  maxGenomeSize: 4 * Math.pow(10, 6),
  desc: (
    <p>
      <strong>{formattedName}</strong> is a species of gram-negative coffee bean-shaped diplococci bacteria responsible for the sexually transmitted infection gonorrhea.
    </p>
  ),
  taxonomy: [
    { taxId: 131567, scientificName: 'Cellular organisms', rank: 'no rank' },
    { taxId: 2, scientificName: 'Bacteria', rank: 'superkingdom' },
    { taxId: 1224, scientificName: 'Proteobacteria', rank: 'phylum' },
    { taxId: 28216, scientificName: 'Betaproteobacteria', rank: 'class' },
    { taxId: 206351, scientificName: 'Neisseriales', rank: 'order' },
    { taxId: 481, scientificName: 'Neisseriaceae', rank: 'family' },
    { taxId: 482, scientificName: 'Neisseria', rank: 'genus' },
    { taxId: 485, scientificName: 'Neisseria gonorrhoeae', rank: 'species' },
  ],
  publicMetadataColumnNames: [],
  collections: [],
  uiOptions: {
    ngMast: true,
    noPopulation: true,
    inctyper: true,
  },
};
