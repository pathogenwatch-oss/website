import React from 'react';

const name = 'Streptococcus pneumoniae';
const formattedName = (<em>{name}</em>);

const shortName = 'S. pneumoniae';
const formattedShortName = (<em>{shortName}</em>);

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  desc: (
    <p>
      {formattedName}, or pneumococcus, is a Gram-positive, alpha-hemolytic, facultative anaerobic member of the genus <em>Streptococcus</em>. A significant human pathogenic bacterium, {formattedShortName} was recognized as a major cause of pneumonia in the late 19th century, and is the subject of many humoral immunity studies.
    </p>
  ),
  taxonomy: [
    { taxId: 131567, scientificName: 'Cellular organisms', rank: 'no rank' },
    { taxId: 2, scientificName: 'Bacteria', rank: 'superkingdom' },
    { taxId: 1783272, scientificName: 'Terrabacteria group', rank: 'no rank' },
    { taxId: 1239, scientificName: 'Firmicutes', rank: 'phylum' },
    { taxId: 91061, scientificName: 'Bacilli', rank: 'class' },
    { taxId: 186826, scientificName: 'Lactobacillales', rank: 'order' },
    { taxId: 1300, scientificName: 'Streptococcaceae', rank: 'family' },
    { taxId: 1301, scientificName: 'Streptococcus', rank: 'genus' },
    { taxId: 1313,
      scientificName: 'Streptococcus pneumoniae',
      rank: 'species' },
  ],
  maxGenomeSize: 3 * Math.pow(10, 6),
  publicMetadataColumnNames: [],
  collections: [],
  uiOptions: {
    inctyper: true,
  },
};
