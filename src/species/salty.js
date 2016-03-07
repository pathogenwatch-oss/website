import React from 'react';

const name = 'Salmonella Typhi';
const formattedName = (() => {
  const [ species, serovar ] = name.split(' ');
  return (
    <span><em>{species}</em> {serovar}</span>
  );
})();

const shortName = 'S. Typhi';
const formattedShortName = (() => {
  const [ species, serovar ] = name.split(' ');
  return (
    <span><em>{species[0]}.</em> {serovar}</span>
  );
})();


export default {
  id: '90370',
  nickname: 'salty',
  name,
  formattedName,
  shortName,
  formattedShortName,
  imagePath: '/assets/img/salty.jpg',
  definitionText: (<span><strong><em>Salmonella</em></strong> <strong>Typhi</strong>,  a common serovar of <em>Salmonella enterica</em> subsp. <em>enterica</em>.</span>),
  active: true,
  desc: '',
  publicMetadataColumnNames: [],
  collections: [],
};
