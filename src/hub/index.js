import './style.css';

import { connect } from 'react-redux';

import Hub from './components/Hub.react';

import * as selectors from './selectors';

function mapStateToProps(state) {
  const { hub, collection } = state;
  return {
    totalFastas: selectors.getTotalFastas(state),
    fastas: selectors.getVisibleFastas(state),
    filterActive: selectors.isFilterActive(state),
    uploads: hub.uploads,
    loading: hub.loading,
    collection,
  };
}

export default connect(mapStateToProps)(Hub);
