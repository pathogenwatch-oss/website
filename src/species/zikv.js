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
      {formattedName} is a member of the virus family <em>Flaviviridae</em> and the genus <em>Flavivirus</em>. It is spread by daytime-active <em>Aedes</em> mosquitoes.
    </p>
  ),
  maxAssemblySize: 15 * Math.pow(10, 3),
  publicMetadataColumnNames: [],
  collections: [
    { id: 'z46p4t05f7gk',
      // name: '',
      author: (<span>Initial Subset of Genomes from GenBank</span>),
      title: (
        <em>Click to view</em>
      ),
      // pmid: '23270620',
    },
  ],
  uiOptions: {
    noPopulation: true,
    noMLST: true,
    noAMR: true,
  },
};
