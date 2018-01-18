import { connect } from 'react-redux';

import Collection from './Collection.react';

import { getCollection } from '../selectors';

import * as actions from '../actions';

function mapStateToProps(state) {
  return {
    collection: getCollection(state),
  };
}

function mapDispatchToProps(dispatch, { match }) {
  return {
    fetch: () => dispatch(actions.fetchCollection(match.params.slug)),
    reset: () => dispatch(actions.resetCollectionView()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
