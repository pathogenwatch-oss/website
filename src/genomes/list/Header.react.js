import React from 'react';
import { connect } from 'react-redux';

const ListItem = ({ onClick }) => {
  return (
    <div className="wgsa-genome-list-item wgsa-genome-list-header wgsa-content-margin-right">
      <span className="wgsa-overflow-fade">Name</span>
      <span className="wgsa-overflow-fade">Organism</span>
      <div className="wgsa-card-content">
        <span className="wgsa-card-metadata">Country</span>
        <span className="wgsa-card-metadata">Date</span>
        <span className="wgsa-card-metadata">Access</span>
      </div>
      <span className="wgsa-card-metadata" style={{ width: 32 }}></span>
    </div>
  );
};

function mapDispatchToProps(dispatch, { item }) {
  return {
    // onClick: () => dispatch(showGenomeDrawer(item.id)),
  };
}

export default connect(null, mapDispatchToProps)(ListItem);
