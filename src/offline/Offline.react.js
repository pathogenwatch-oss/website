import React from 'react';
import { connect } from 'react-redux';

import StaticGrid from '../components/static-grid';
import CollectionCard from '../collections/CollectionCard.react';
import Spinner from '../components/Spinner.react';

import { getStatus, getCollections } from './selectors';

import { loadCollections } from './actions';

import { isSupported } from './utils';

import { statuses } from './constants';

const Supported = () => (
  <div className="wgsa-page wgsa-compact-page">
    <h1>Offline Mode</h1>
    <p>Offline mode allows you to save specific collections for use even when you lose network connectivity.</p>
    <h2>How to</h2>
    <p>
      When viewing a collection, on the right side of the header bar is a <i className="material-icons">info</i> icon.
      Clicking this icon will reveal the <strong>Save for Offline</strong> button.
      Click this button and allow the page to refresh and your collection should be available offline, hurrah!
    </p>
    <p>Saved collections are listed on this page to refer to when you need them.</p>
  </div>
);

const NotSupported = () => (
  <div className="wgsa-page wgsa-compact-page">
    <h1>Oh no!</h1>
    <p>Unfortunately your browser does not support the technology needed for Offline Mode.</p>
    <p>We're super sorry. 😞</p>
  </div>
)

const Intro = () => (isSupported() ? <Supported /> : <NotSupported />);

const CollectionList = ({ collections }) => (
  <div className="wgsa-page">
    <h1>Saved Collections</h1>
    <StaticGrid
      items={collections}
      template={CollectionCard}
      keyProp="uuid"
    />
  </div>
);

const Offline = React.createClass({

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
