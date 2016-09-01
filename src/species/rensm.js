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
  maxAssemblySize: 4 * Math.pow(10, 6),
  publicMetadataColumnNames: [],
  collections: [],
};
