import React from 'react';

const name = 'Klebsiella variicola';
const formattedName = <em>{name}</em>;

const shortName = 'K. variicola';
const formattedShortName = <em>{shortName}</em>;

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  maxGenomeSize: 4 * Math.pow(10, 6),
  desc: (
    <p>
      <strong>{formattedName}</strong>{' '}
      https://en.wikipedia.org/wiki/Klebsiella_variicola
    </p>
  ),
  taxonomy: [
    { taxId: 131567, scientificName: 'Cellular organisms', rank: 'no rank' },
    { taxId: 2, scientificName: 'Bacteria', rank: 'superkingdom' },
    { taxId: 1224, scientificName: 'Proteobacteria', rank: 'phylum' },
    { taxId: 1236, scientificName: 'Gammaproteobacteria', rank: 'class' },
    { taxId: 91347, scientificName: 'Enterobacteriales', rank: 'order' },
    { taxId: 543, scientificName: 'Enterobacteriaceae', rank: 'family' },
    { taxId: 570, scientificName: 'Klebsiella', rank: 'genus' },
    { taxId: 244366, scientificName: 'Klebsiella variicola', rank: 'species' },
  ],
  publicMetadataColumnNames: [],
  collections: [],
  uiOptions: {
  },
};
