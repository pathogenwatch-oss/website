import React from 'react';
import TableMetadata from './table/metadata/Table.react';
import TableResistanceProfile from './table/resistance-profile/Table.react';

import CollectionNavigationStore from '../stores/CollectionNavigationStore';

var sectionStyle = {
  width: '100%',
  height: '100%',
};

var Data = React.createClass({

  getInitialState: function () {
    return {
      activeCollectionNavigation: null,
    };
  },

  componentDidMount: function () {
    CollectionNavigationStore.addChangeListener(this.handleCollectionNavigationStoreChange);

    this.setState({
      activeCollectionNavigation: CollectionNavigationStore.getCollectionNavigation(),
    });
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
    var activeCollectionNavigation = this.state.activeCollectionNavigation;
    var COLLECTION_NAVIGATION_STATES = CollectionNavigationStore.getCollectionNavigationStates();

    if (! activeCollectionNavigation) {
      return null;
    }

    if (activeCollectionNavigation === COLLECTION_NAVIGATION_STATES.TABLE_METADATA) {
      return <TableMetadata />;
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

module.exports = Data;
