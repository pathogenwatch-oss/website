import React from 'react';
import { connect } from 'react-redux';

import AddToSelectionButton from '../card/AddToSelectionButton.react';
import { FormattedName } from '../../organisms';
import Metadata from '../card/GenomeMetadata.react.js';

import { showGenomeDrawer } from '../../genome-drawer';

const ListItem = ({ item, onClick, style }) => {
  const { name, organismId, analysis = {} } = item;
  const { specieator } = analysis;
  return (
    <div
      className="wgsa-genome-list-item wgsa-genome-list-item--selectable wgsa-card--bordered"
      style={style}
      onClick={onClick}
      title="View Details"
    >
      <span className="wgsa-genome-list-cell wgsa-overflow-fade" title={name}>{name}</span>
      <span className="wgsa-genome-list-cell wgsa-overflow-fade">
        { specieator ?
            <FormattedName
              organismId={organismId}
              title={specieator.organismName}
              fullName
            /> :
            <span>&nbsp;</span> }
      </span>
      <Metadata genome={item} tableCell />
      <span onClick={e => e.stopPropagation()} className="wgsa-genome-list-cell">
        <AddToSelectionButton genome={item} />
      </span>
    </div>
  );
};

function mapDispatchToProps(dispatch, { item }) {
  return {
    onClick: () => dispatch(showGenomeDrawer(item.id)),
  };
}

export default connect(null, mapDispatchToProps)(ListItem);
