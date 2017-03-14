import React from 'react';

import AddToSelectionButton from '../card/AddToSelectionButton.react';
import { FormattedName } from '../../organisms';
import Metadata from '../card/GenomeMetadata.react.js';

export default ({ item }) => {
  const { name, organismId, organismName } = item;
  return (
    <div className="wgsa-genome-list-item wgsa-card--bordered">
      <span className="wgsa-card-title" title={name}>{name}</span>
      <span className="wgsa-card-subtitle">
        { organismName ?
            <FormattedName
              organismId={organismId}
              title={organismName}
              fullName
            /> :
            <span>&nbsp;</span> }
      </span>
      <Metadata genome={item} />
      <AddToSelectionButton genome={item} />
    </div>
  );
};
