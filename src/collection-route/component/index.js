import { connect } from 'react-redux';

import Collection from './Collection.react';

import {
  fetchCollection, fetchSpeciesData, updateProgress,
} from '../actions';
import { resetStore } from '../../actions/reset';

import { getProgressPercentage } from '../progress/selectors.js';

import Species from '../../species';

function mapStateToProps({ collection }) {
  return {
    status: collection.status,
    progress: collection.progress,
    metadata: collection.metadata,
    percentage: getProgressPercentage(collection),
  };
}

function mapDispatchToProps(dispatch, { params: { id } }) {
  return {
    initialise: () => dispatch(fetchCollection(id)),
    checkStatus: () => dispatch(fetchCollection(id)),
    updateProgress: results => dispatch(updateProgress(results)),
    fetch: () => dispatch(fetchSpeciesData(Species.id)),
    reset: () => dispatch(resetStore()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
