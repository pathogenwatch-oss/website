import React from 'react';

const name = 'Candida auris';
const formattedName = (<em>{name}</em>);

const shortName = 'C. auris';
const formattedShortName = (<em>{shortName}</em>);

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  maxGenomeSize: 4 * Math.pow(10, 6),
  desc: (
    <p>
      <strong>{formattedName}</strong> https://en.wikipedia.org/wiki/Candida_auris
    </p>
  ),
  taxonomy: [
    { taxId: 131567, scientificName: 'Cellular organisms', rank: 'no rank' },
    { taxId: 2759, scientificName: 'Eukaryota', rank: 'superkingdom' },
    { taxId: 4890, scientificName: 'Ascomycota', rank: 'phylum' },
    { taxId: 4891, scientificName: 'Saccharomycetes', rank: 'class' },
    { taxId: 4892, scientificName: 'Saccharomycetales', rank: 'order' },
    { taxId: 27319, scientificName: 'Metschnikowiaceae', rank: 'family' },
    { taxId: 36910, scientificName: 'Clavispora', rank: 'genus' },
    { taxId: 498019, scientificName: 'Candida auris', rank: 'species' },
  ],
  publicMetadataColumnNames: [],
  collections: [],
  uiOptions: {
    noMLST: true,
    noAMR: true,
  },
};
