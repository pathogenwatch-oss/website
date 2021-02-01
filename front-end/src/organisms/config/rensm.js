import React from 'react';

const name = 'Renibacterium salmoninarum';
const formattedName = (<em>{name}</em>);
const shortName = 'R. salmoninarum';
const formattedShortName = (<em>{shortName}</em>);

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  desc: (
    <p>
      {formattedName} is a member of the Micrococcaceae family. It is a Gram-positive, intracellular bacterium that causes disease in young salmonid fish.
    </p>
  ),
  taxonomy: [
    { taxId: 131567, scientificName: 'Cellular organisms', rank: 'no rank' },
    { taxId: 2, scientificName: 'Bacteria', rank: 'superkingdom' },
    { taxId: 1783272, scientificName: 'Terrabacteria group', rank: 'no rank' },
    { taxId: 201174, scientificName: 'Actinobacteria', rank: 'phylum' },
    { taxId: 1760, scientificName: 'Actinobacteria', rank: 'class' },
    { taxId: 85006, scientificName: 'Micrococcales', rank: 'order' },
    { taxId: 1268, scientificName: 'Micrococcaceae', rank: 'family' },
    { taxId: 1645, scientificName: 'Renibacterium', rank: 'genus' },
    { taxId: 1646,
      scientificName: 'Renibacterium salmoninarum',
      rank: 'species' },
  ],
  maxGenomeSize: 4 * Math.pow(10, 6),
  publicMetadataColumnNames: [],
  collections: [],
  uiOptions: {
    noMLST: true,
    noAMR: true,
  },
};
