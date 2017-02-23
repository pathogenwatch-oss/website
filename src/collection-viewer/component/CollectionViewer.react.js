import React from 'react';
import { connect } from 'react-redux';

import Layout from '../layout/Layout.react';
import DownloadsMenu from '../downloads/DownloadsMenu.react';

import { getCollection } from '../selectors';

const CollectionViewer = React.createClass({

  componentDidMount() {
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
  const { metadata = {} } = getCollection(state);
  return {
    title: metadata.title,
  };
}

export default connect(mapStateToProps)(CollectionViewer);
