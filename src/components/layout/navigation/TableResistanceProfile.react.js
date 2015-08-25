import React from 'react';

import CollectionNavigationStore from '../../../stores/CollectionNavigationStore';
import CollectionNavigationActionCreators from '../../../actions/CollectionNavigationActionCreators';
import { CGPS } from '../../../defaults';

const style = {
  background: CGPS.COLOURS.PURPLE,
  position: 'relative',
  top: '-20px',
  marginLeft: '4px',
};

const TableResistanceProfile = React.createClass({

  handleClick: function () {
    const COLLECTION_NAVIGATION_STATES = CollectionNavigationStore.getCollectionNavigationStates();
    CollectionNavigationActionCreators.setCollectionNavigation(COLLECTION_NAVIGATION_STATES.TABLE_RESISTANCE_PROFILE);
  },

  render: function () {
    return (
      <button
        className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect"
        title="Resistance"
        style={style}
        onClick={this.handleClick}>
        <i className="material-icons" style={{ color: '#fff' }}>local_pharmacy</i>
      </button>
    );
  }
});

module.exports = TableResistanceProfile;
