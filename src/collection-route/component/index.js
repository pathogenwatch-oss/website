import { connect } from 'react-redux';

import Collection from './Collection.react';

import {
  fetchCollection, fetchSpeciesData, updateProgress,
} from '../actions';

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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
