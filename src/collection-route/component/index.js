import { connect } from 'react-redux';

import Collection from './Collection.react';

import { getCollection } from '../selectors';
import { getProgressPercentage } from '../progress/selectors.js';

import {
  fetchCollection, fetchSpeciesData, updateProgress,
} from '../actions';

import Species from '../../species';

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
    initialise: () => dispatch(fetchCollection(id)),
    checkStatus: () => dispatch(fetchCollection(id)),
    updateProgress: results => dispatch(updateProgress(results)),
    fetch: () => dispatch(fetchSpeciesData(Species.id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
