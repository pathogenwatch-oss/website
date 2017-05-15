import React from 'react';
import { connect } from 'react-redux';

import Layout from '../layout/Layout.react';
import DownloadsMenu from '../downloads/DownloadsMenu.react';

import { getCollection } from '../selectors';

const CollectionViewer = React.createClass({

  componentWillMount() {
    document.title = `WGSA | ${this.props.title || 'Explore Collection'}`;
  },

  render() {
    return (
      <div>
        <Layout />
        <DownloadsMenu />
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    title: getCollection(state).title,
  };
}

export default connect(mapStateToProps)(CollectionViewer);
