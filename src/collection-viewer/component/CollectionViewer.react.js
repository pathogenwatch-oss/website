import React from 'react';
import { connect } from 'react-redux';
import removeMarkdown from 'remove-markdown';

import Layout from '../layout/Layout.react';
import DownloadsMenu from '../downloads/DownloadsMenu.react';

import { getCollection } from '../selectors';

const CollectionViewer = createClass({

  componentWillMount() {
    const { title } = this.props;
    const sanitisedTitle = title ? removeMarkdown(title) : 'Explore Collection';
    document.title = `WGSA | ${sanitisedTitle}`;
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
