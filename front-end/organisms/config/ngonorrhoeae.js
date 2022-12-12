import React from 'react';

const name = 'Neisseria gonorrhoeae';
const formattedName = (<em>{name}</em>);

const shortName = 'N. gonorrhoeae';
const formattedShortName = (<em>{shortName}</em>);

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  maxGenomeSize: 4 * Math.pow(10, 6),
  desc: (
    <p>
      <strong>{formattedName}</strong> is a species of gram-negative coffee bean-shaped diplococci bacteria responsible for the sexually transmitted infection gonorrhea.
    </p>
  ),
  publicMetadataColumnNames: [],
  collections: [],
  uiOptions: {
    exclude: [ 'inctyper' ],
  },
};
