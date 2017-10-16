import { connect } from 'react-redux';

import Collection from './Collection.react';

import { getCollection } from '../selectors';


import * as actions from '../actions';

import { getUuidFromSlug } from '../utils';

import { statuses } from '../constants';

function mapStateToProps(state) {
  return {
    collection: getCollection(state),
  };
}

function mapDispatchToProps(dispatch, { match }) {
  const uuid = getUuidFromSlug(match.params.slug);
  return {
    fetch: () => dispatch(actions.fetchCollection(uuid)),
    updateProgress: results => (
      results.status === statuses.READY ?
        dispatch(actions.fetchCollection(uuid)) :
        dispatch(actions.updateProgress(results))
    ),
    reset: () => dispatch(actions.resetCollectionView()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
