import React from 'react';
import { connect } from 'react-redux';

import AddToSelectionButton from '../card/AddToSelectionButton.react';
import { FormattedName } from '../../organisms';
import Metadata from '../card/GenomeMetadata.react.js';

import { showGenomeDrawer } from '../../genome-drawer';

const ListItem = ({ item, onClick }) => {
  const { name, organismId, organismName } = item;
  return (
    <div className="wgsa-genome-list-item wgsa-card--bordered" onClick={onClick} title="View Details">
      <span className="wgsa-card-title wgsa-overflow-fade" title={name}>{name}</span>
      <span className="wgsa-card-subtitle wgsa-overflow-fade">
        { organismName ?
            <FormattedName
              organismId={organismId}
              title={organismName}
              fullName
            /> :
            <span>&nbsp;</span> }
      </span>
      <Metadata genome={item} tableCell />
      <span onClick={e => e.stopPropagation()}>
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
