import React from 'react';
import { connect } from 'react-redux';

import Layout from '../layout/Layout.react';
import DownloadsMenu from '../downloads';
import DocumentTitle from '~/branding/DocumentTitle.react';
import ProgressListener from '../ProgressListener.react';
import AddMetadata from '../private-metadata';

import { getCollectionTitle } from '../selectors';

const CollectionViewer = ({ title }) => (
  <React.Fragment>
    <DocumentTitle>{title}</DocumentTitle>
    <Layout />
    <AddMetadata />
    <DownloadsMenu />
    <ProgressListener />
  </React.Fragment>
);

function mapStateToProps(state) {
  return {
    title: getCollectionTitle(state) || 'Explore Collection',
  };
}

export default connect(mapStateToProps)(CollectionViewer);
