import React from 'react';

const name = 'Vibrio cholerae';
const formattedName = (<em>{name}</em>);
const shortName = 'V. cholerae';
const formattedShortName = (<em>{shortName}</em>);

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  desc: (
    <p>
      TBD.
    </p>
  ),
  taxonomy: [
    { taxId: 131567, scientificName: 'Cellular organisms', rank: 'no rank' },
    { taxId: 2, scientificName: 'Bacteria', rank: 'superkingdom' },
    { taxId: 1224, scientificName: 'Proteobacteria', rank: 'phylum' },
    { taxId: 1236, scientificName: 'Gammaproteobacteria', rank: 'class' },
    { taxId: 135623, scientificName: 'Vibrionales', rank: 'order' },
    { taxId: 641, scientificName: 'Vibrionaceae', rank: 'family' },
    { taxId: 662, scientificName: 'Vibrio', rank: 'genus' },
    { taxId: 666, scientificName: 'Vibrio cholerae', rank: 'species' },
  ],
  maxGenomeSize: 7 * Math.pow(10, 6),
  publicMetadataColumnNames: [],
  collections: [],
  uiOptions: {},
};
