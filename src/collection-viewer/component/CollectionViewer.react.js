import React from 'react';
import { connect } from 'react-redux';
import removeMarkdown from 'remove-markdown';

import Layout from '../layout/Layout.react';
import DownloadsMenu from '../downloads';
import DocumentTitle from '../../branding/DocumentTitle.react';

import { getCollection } from '../selectors';

const CollectionViewer = ({ title }) => (
  <React.Fragment>
    <DocumentTitle title={title ? removeMarkdown(title) : 'Explore Collection'} />
    <Layout />
    <DownloadsMenu />
  </React.Fragment>
);

function mapStateToProps(state) {
  return {
    title: getCollection(state).title,
  };
}

export default connect(mapStateToProps)(CollectionViewer);
