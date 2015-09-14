import React from 'react';
import TableMetadata from './table/metadata/Table.react';
import TableResistanceProfile from './table/resistance-profile/Table.react';

import CollectionNavigationStore from '../stores/CollectionNavigationStore';

const sectionStyle = {
  width: '100%',
  height: '100%',
};

export default React.createClass({

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
  },

  getInitialState: function () {
    return {
      activeCollectionNavigation: CollectionNavigationStore.getCollectionNavigation(),
    };
  },

  componentDidMount: function () {
    CollectionNavigationStore.addChangeListener(this.handleCollectionNavigationStoreChange);
  },

  componentWillUnmount: function () {
    CollectionNavigationStore.removeChangeListener(this.handleCollectionNavigationStoreChange);
  },

  handleCollectionNavigationStoreChange: function () {
    this.setState({
      activeCollectionNavigation: CollectionNavigationStore.getCollectionNavigation(),
    });
  },

  getCollectionDataComponent: function () {
    const activeCollectionNavigation = this.state.activeCollectionNavigation;
    const COLLECTION_NAVIGATION_STATES = CollectionNavigationStore.getCollectionNavigationStates();

    if (! activeCollectionNavigation) {
      return null;
    }

    if (activeCollectionNavigation === COLLECTION_NAVIGATION_STATES.TABLE_METADATA) {
      return <TableMetadata { ...this.props }/>;
    } else if (activeCollectionNavigation === COLLECTION_NAVIGATION_STATES.TABLE_RESISTANCE_PROFILE) {
      return <TableResistanceProfile />;
    }
  },

  render: function () {
    return (
      <section style={sectionStyle}>
        {this.getCollectionDataComponent()}
      </section>
    );
  },

});
