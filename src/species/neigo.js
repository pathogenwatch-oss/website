import React from 'react';

const name = 'Neisseria gonorrhoeae';
const formattedName = (<em>{name}</em>);

const shortName = 'N. gonorrhoeae';
const formattedShortName = (<em>{name}</em>);

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  maxAssemblySize: 4 * Math.pow(10, 6),
  // gcRange: {
  //   min: 31,
  //   max: 35,
  // },
  desc: (
    <p>
      {formattedName} is a species of gram-negative coffee bean-shaped diplococci bacteria responsible for the sexually transmitted infection gonorrhea.
    </p>
  ),
  publicMetadataColumnNames: [],
  collections: [],
};
