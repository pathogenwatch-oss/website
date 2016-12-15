import { connect } from 'react-redux';

import Collection from './Collection.react';

import { getCollection } from '../selectors';
import { getProgressPercentage } from '../progress/selectors.js';

import { updateProgress, resetCollectionView } from '../actions';

import { fetchCollection } from '../thunks';

function mapStateToProps(state) {
  const collection = getCollection(state);
  return {
    status: collection.status,
    progress: collection.progress,
    metadata: collection.metadata,
    percentage: getProgressPercentage(state),
  };
}

function mapDispatchToProps(dispatch, { params: { id } }) {
  return {
    fetch: () => dispatch(fetchCollection(id)),
    updateProgress: results => dispatch(updateProgress(results)),
    reset: () => dispatch(resetCollectionView()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
