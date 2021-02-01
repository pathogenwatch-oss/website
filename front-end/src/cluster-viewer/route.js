import './styles.css';

import { connect } from 'react-redux';
import { parse } from 'query-string';

import Collection from '../collection-viewer/route/Collection.react';

import { getCollection } from '../collection-viewer/selectors';

import { fetchCluster } from './actions';
import { resetCollectionView } from '../collection-viewer/actions';

function mapStateToProps(state) {
  return {
    collection: getCollection(state),
  };
}

function mapDispatchToProps(dispatch, { match, location }) {
  const query = parse(location.search);
  return {
    fetch: () => dispatch(fetchCluster(match.params.id, query.threshold)),
    reset: () => dispatch(resetCollectionView()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
