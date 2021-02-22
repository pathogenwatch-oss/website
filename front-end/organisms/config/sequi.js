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
      The bacterium, <strong>Streptococcus equi</strong>, is the cause of the disease known as strangles in equine species (horses, donkeys, mules).
      The disease is so named as it can cause suffocation by inflamed lymph nodes in their upper airway and trachea - <a href="https://en.wikipedia.org/wiki/Strangles">Wikipedia</a>.
    </p>
  ),
  maxGenomeSize: 15 * Math.pow(10, 3),
  publicMetadataColumnNames: [],
  uiOptions: {
    noPopulation: true,
    noAMR: true,
  },
};
