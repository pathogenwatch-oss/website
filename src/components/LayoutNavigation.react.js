import React from 'react';

import Switch from './Switch.react';

import CollectionNavigationStore from '../stores/CollectionNavigationStore';
import CollectionNavigationActionCreators from '../actions/CollectionNavigationActionCreators';

const style = {
  position: 'absolute',
  zIndex: 999,
  transform: 'translateY(-50%)',
  background: '#fff',
  left: 16,
  padding: '4px 8px',
  borderRadius: 24,
};

export default React.createClass({

  propTypes: {
    top: React.PropTypes.number,
  },

  render: function () {
    style.top = this.props.top;
    return (
      <div style={style} className="mdl-shadow--2dp">
        <Switch
          id="table-switcher"
          left={{ title: 'Metadata', icon: 'list' }}
          right={{ title: 'Resistance Profile', icon: 'local_pharmacy' }}
          onChange={this.handleClick} />
      </div>
    );
  },

  handleClick: function (checked) {
    const { TABLE_METADATA, TABLE_RESISTANCE_PROFILE } = CollectionNavigationStore.getCollectionNavigationStates();
    CollectionNavigationActionCreators.setCollectionNavigation(
      checked ? TABLE_RESISTANCE_PROFILE : TABLE_METADATA
    );
  },
});
