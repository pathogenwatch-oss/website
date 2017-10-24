import React from 'react';

const name = 'Zika virus';
const formattedName = (<em>{name}</em>);
const shortName = 'Zika';
const formattedShortName = (<em>{shortName}</em>);

export default {
  name,
  formattedName,
  shortName,
  formattedShortName,
  desc: (
    <p>
      <strong>Zika virus (ZIKV)</strong> is a member of the virus family <em>Flaviviridae</em>. It is spread by daytime-active <em>Aedes</em> mosquitoes, such as <em>A. aegypti</em> and <em>A. albopictus</em>. Its name comes from the Zika Forest of Uganda, where the virus was first isolated in 1947.
    </p>
  ),
  taxonomy: [
    { taxId: 10239, scientificName: 'Viruses', rank: 'superkingdom' },
    { taxId: 439488, scientificName: 'ssRNA viruses', rank: 'no rank' },
    { taxId: 35278,
      scientificName: 'ssRNA positive-strand viruses, no DNA stage',
      rank: 'no rank' },
    { taxId: 11050, scientificName: 'Flaviviridae', rank: 'family' },
    { taxId: 11051, scientificName: 'Flavivirus', rank: 'genus' },
    { taxId: 64320, scientificName: 'Zika virus', rank: 'species' },
  ],
  maxGenomeSize: 15 * Math.pow(10, 3),
  publicMetadataColumnNames: [],
  uiOptions: {
    noPopulation: true,
    noMLST: true,
    noAMR: true,
  },
};
