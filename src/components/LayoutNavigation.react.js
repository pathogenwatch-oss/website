import React from 'react';
import assign from 'object-assign';

import Switch from './Switch.react';

import CollectionNavigationStore from '../stores/CollectionNavigationStore';
import CollectionNavigationActionCreators from '../actions/CollectionNavigationActionCreators';

const style = {
  position: 'absolute',
  zIndex: 2,
  transform: 'translateY(-50%)',
  left: 16,
};

export default React.createClass({

  displayName: 'LayoutNavigation',

  propTypes: {
    top: React.PropTypes.number,
  },

  render() {
    return (
      <div style={assign({}, style, this.props)} className="wgsa-switch-background mdl-shadow--2dp">
        <Switch
          id="table-switcher"
          left={{ title: 'Metadata', icon: 'list' }}
          right={{ title: 'Resistance Profile', icon: 'local_pharmacy' }}
          onChange={this.handleClick} />
      </div>
    );
  },

  handleClick(checked) {
    const { TABLE_METADATA, TABLE_RESISTANCE_PROFILE } = CollectionNavigationStore.getCollectionNavigationStates();
    CollectionNavigationActionCreators.setCollectionNavigation(
      checked ? TABLE_RESISTANCE_PROFILE : TABLE_METADATA
    );
  },
});
