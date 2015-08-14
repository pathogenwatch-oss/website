import React from 'react';

import CollectionNavigationStore from '../../../stores/CollectionNavigationStore';
import CollectionNavigationActionCreators from '../../../actions/CollectionNavigationActionCreators';

const style = {
  display: 'inline-block',
  margin: '0 5px',
  lineHeight: '24px',
  cursor: 'pointer',
};

const TableMetadata = React.createClass({

  handleClick: function () {
    const COLLECTION_NAVIGATION_STATES = CollectionNavigationStore.getCollectionNavigationStates();
    CollectionNavigationActionCreators.setCollectionNavigation(COLLECTION_NAVIGATION_STATES.TABLE_METADATA);
  },

  render: function () {
    return (
      <i className="material-icons" onClick={this.handleClick} title="Label" style={style}>list</i>
    );
  }
});

module.exports = TableMetadata;
