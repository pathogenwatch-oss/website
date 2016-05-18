import React from 'react';

const name = 'Zika virus';
const formattedName = (<span>{name}</span>);
const shortName = 'Zika';
const formattedShortName = (<span>{shortName}</span>);


export default {
  id: '1646',
  nickname: 'zikv',
  name,
  formattedName,
  shortName,
  formattedShortName,
  desc: (
    <p>
      <strong>{name}</strong> is a member of the virus family <em>Flaviviridae</em> and the genus <em>Flavivirus</em>. It is spread by daytime-active <em>Aedes</em> mosquitoes.
    </p>
  ),
  maxAssemblySize: 15 * Math.pow(10, 3),
  publicMetadataColumnNames: [],
  collections: [],
};
