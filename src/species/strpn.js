import React from 'react';

const name = 'Streptococcus pneumoniae';
const formattedName = (<em>{name}</em>);

const shortName = 'S. pneumoniae';
const formattedShortName = (<em>{shortName}</em>);

export default {
  id: '1313',
  nickname: 'strpn',
  name,
  formattedName,
  shortName,
  formattedShortName,
  desc: (
    <p>
      {formattedName}, or pneumococcus, is a Gram-positive, alpha-hemolytic, facultative anaerobic member of the genus <em>Streptococcus</em>. A significant human pathogenic bacterium, {formattedShortName} was recognized as a major cause of pneumonia in the late 19th century, and is the subject of many humoral immunity studies.
    </p>
  ),
  maxAssemblySize: 3 * Math.pow(10, 6),
  publicMetadataColumnNames: [],
  collections: [],
};
