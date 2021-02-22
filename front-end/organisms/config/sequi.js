import React from 'react';

const name = 'Streptococcus equi';
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
      The bacterium, <strong>Streptococcus equi</strong>, is what causes the disease in equine species (horses, donkeys, mules) called strangles.
      It got its name because historically, affected horses were sometimes suffocated from inflamed lymph nodes in their upper airway and trachea.
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
  ],
  maxGenomeSize: 15 * Math.pow(10, 3),
  publicMetadataColumnNames: [],
  uiOptions: {
    noPopulation: true,
    noAMR: true,
    inctyper: true,
  },
};
