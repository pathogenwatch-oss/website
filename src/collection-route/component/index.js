import { connect } from 'react-redux';

import Collection from './Collection.react';

import { getCollection } from '../selectors';
import { getProgressPercentage } from '../progress/selectors.js';

import * as actions from '../actions';

function mapStateToProps(state) {
  const collection = getCollection(state);
  return {
    collection,
    percentage: getProgressPercentage(state),
  };
}

function mapDispatchToProps(dispatch, { params: { id } }) {
  return {
    fetch: () => dispatch(actions.fetchCollection(id)),
    updateProgress: results => dispatch(actions.updateProgress(results)),
    reset: () => dispatch(actions.resetCollectionView()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
