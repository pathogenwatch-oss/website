import React from 'react';
import { connect } from 'react-redux';

import StaticGrid from '../components/static-grid';
import CollectionCard from '../collections/CollectionCard.react';
import Spinner from '../components/Spinner.react';

import { getStatus, getCollections } from './selectors';

import { loadCollections } from './actions';

import { isSupported, isOffline } from './utils';

import { statuses } from './constants';

const Supported = () => (
  <div className="wgsa-page wgsa-compact-page">
    <h1>Offline Mode</h1>
    <p>Offline mode allows you to save specific collections for use even when you lose network connectivity.</p>
    <h2>How to Save Collections</h2>
    <p>
      <img src="/images/save-for-offline.png" />
    </p>
    <p>
      When viewing a collection, click on the <i className="material-icons">info</i> icon in header bar, revealing the <strong>Save for Offline Use</strong> button.
      Click this button, allow the page to refresh and your collection should be available offline, hurrah!
    </p>
    <p>Saved collections are listed on this page when you need them.</p>
  </div>
);

const NotSupported = () => (
  <div className="wgsa-page wgsa-compact-page">
    <h1>Oh no!</h1>
    <p>Unfortunately your browser does not support the technology needed for Offline Mode.</p>
    <p>We're super sorry. 😞</p>
  </div>
);

const Intro = () => (isSupported() ? <Supported /> : <NotSupported />);

const CollectionList = ({ collections }) => (
  <div className="wgsa-page">
    <h1>Saved Collections</h1>
    { isOffline() ? null : <p>These collections will be available when you are offline.</p>}
    <StaticGrid
      items={collections}
      template={CollectionCard}
      keyProp="uuid"
    />
  </div>
);

const Offline = React.createClass({

  componentWillMount() {
    document.title = 'WGSA | Offline';
  },

  componentDidMount() {
    this.props.loadCollections();
  },

  render() {
    const { status, collections } = this.props;
    if (status === statuses.LOADING) {
      return (
        <div className="wgsa-page">
          <Spinner />;
        </div>
      );
    }
    return (
      collections.length ?
        <CollectionList collections={collections} /> :
        <Intro />
    );
  },

});

function mapStateToProps(state) {
  return {
    status: getStatus(state),
    collections: getCollections(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadCollections: () => dispatch(loadCollections()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Offline);
