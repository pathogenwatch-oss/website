import React from 'react';

import CollectionNavigationStore from '../../../stores/CollectionNavigationStore';
import CollectionNavigationActionCreators from '../../../actions/CollectionNavigationActionCreators';

const style = {
  display: 'inline-block',
  margin: '0 5px',
  lineHeight: '24px',
  cursor: 'pointer',
};

const TableResistanceProfile = React.createClass({

  handleClick: function () {
    const COLLECTION_NAVIGATION_STATES = CollectionNavigationStore.getCollectionNavigationStates();
    CollectionNavigationActionCreators.setCollectionNavigation(COLLECTION_NAVIGATION_STATES.TABLE_RESISTANCE_PROFILE);
  },

  render: function () {
    return (
      <i className="fa fa-circle" onClick={this.handleClick} title="Colour" style={style}></i>
    );
  }
});

module.exports = TableResistanceProfile;
