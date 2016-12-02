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
    metadata: collection.metadata,
    percentage: getProgressPercentage(collection),
  };
}

function mapDispatchToProps(dispatch, { params: { id } }) {
  return {
    initialise() {
      dispatch(setCollectionId(id));
      dispatch(checkStatus(id));
    },
    checkStatus: () => dispatch(checkStatus(id)),
    updateProgress: results => dispatch(updateProgress(results)),
    fetch: () => dispatch(fetchEntities(Species.id, id)),
    reset: () => dispatch(resetStore()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
