import { connect } from 'react-redux';

import Collection from '../collection-viewer/route/Collection.react';

import { getCollection } from '../collection-viewer/selectors';

import { fetchCluster } from './actions';
import { resetCollectionView } from '../collection-viewer/actions';

function mapStateToProps(state) {
  return {
    collection: getCollection(state),
  };
}

function mapDispatchToProps(dispatch, { match }) {
  return {
    fetch: (threshold) => dispatch(fetchCluster(match.params.id, threshold)),
    reset: () => dispatch(resetCollectionView()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
