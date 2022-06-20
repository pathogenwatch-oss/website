import React from 'react';

const name = 'Klebsiella quasipneumoniae';
const formattedName = <em>{name}</em>;

const shortName = 'K. quasipneumoniae';
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
      is a member of the Klebsiella pneumoniae complex species group, and can also cause infections in humans..
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
    { taxId: 1463165, scientificName: 'Klebsiella quasipneumoniae', rank: 'species' },
  ],
  publicMetadataColumnNames: [],
  collections: [],
  uiOptions: {
  },
};
