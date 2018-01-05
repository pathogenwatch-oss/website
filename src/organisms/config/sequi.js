import React from 'react';

const name = 'Streptococcus equi subsp. equi';
const formattedName = (<em>{name}</em>);
const shortName = 'S. equi';
const formattedShortName = (<em>{shortName}</em>);

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  desc: (
    <p>
      <strong>Streptococcus equi subsp. equi</strong>.
    </p>
  ),
  taxonomy: [
    { taxId: 131567, scientificName: 'Cellular organisms', rank: 'no rank' },
    { taxId: 2, scientificName: 'Bacteria', rank: 'superkingdom' },
    { taxId: 1783272, scientificName: 'Terrabacteria group', rank: 'no rank' },
    { taxId: 1239, scientificName: 'Firmicutes', rank: 'phylum' },
    { taxId: 91061, scientificName: 'Bacilli', rank: 'class' },
    { taxId: 148942, scientificName: 'Lactobacillales', rank: 'order' },
    { taxId: 1300, scientificName: 'Staphylococcaceae', rank: 'family' },
    { taxId: 1301, scientificName: 'Staphylococcus', rank: 'genus' },
    { taxId: 119603, scientificName: 'Staphylococcus', rank: 'genus' },
    { taxId: 1280, scientificName: 'Streptococcus dysgalactiae group', rank: 'species group' },
    { taxId: 1336, scientificName: 'Streptococcus equi', rank: 'species' },
    { taxId: 148942, scientificName: 'Streptococcus equi subsp. equi', rank: 'subspecies' },
  ],
  maxGenomeSize: 15 * Math.pow(10, 3),
  publicMetadataColumnNames: [],
  uiOptions: {
    noPopulation: true,
    noAMR: true,
  },
};
