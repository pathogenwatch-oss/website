import { connect } from 'react-redux';

import Collection from './Collection.react';

import { setCollectionId } from '../../actions/collection';
import {
  checkStatus, fetchEntities, updateProgress,
} from '../../actions/fetch';
import { resetStore } from '../../actions/reset';

import { getProgressPercentage } from '../../collection/selectors.js';

import Species from '../../species';

function mapStateToProps({ collection }) {
  return {
    status: collection.status,
    progress: collection.progress,
    cas: collection.cas,
    metadata: collection.metadata,
    percentage: getProgressPercentage(collection),
  };
}

function mergeProps(state, { dispatch }, { params: { id } }) {
  return {
    ...state,
    initialise() {
      dispatch(setCollectionId(id));
      dispatch(checkStatus(Species.id, id));
    },
    checkStatus: () => dispatch(checkStatus(Species.id, id, state.cas)),
    updateProgress: results => dispatch(updateProgress(results)),
    fetch: () => dispatch(fetchEntities(Species.id, id)),
    reset: () => dispatch(resetStore()),
  };
}

export default connect(mapStateToProps, null, mergeProps)(Collection);
