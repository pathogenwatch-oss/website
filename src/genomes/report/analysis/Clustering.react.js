import React from 'react';
import { connect } from 'react-redux';

import Spinner from '../../../components/Spinner.react';
import { getClusteringStatus } from '../selectors';
import { requestClustering } from '../actions';

const Clustering = ({ clustering, status, onClick }) => (
  <React.Fragment>
    <h2>Clustering</h2>
    <p>Clusters have not yet been determined for this genome. {status}</p>
    <button
      className="mdl-button mdl-button--raised mdl-button--colored"
      disabled={!!status && status !== 'ERROR'}
      onClick={onClick}
    >
      Cluster Now
    </button>
    { status === 'LOADING' && <Spinner /> }
    { status === 'ERROR' && <p>Something went wrong :(</p> }
    { status === 'PENDING' && <p>Hold tight!</p> }
  </React.Fragment>
);

function mapStateToProps(state) {
  return {
    status: getClusteringStatus(state),
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    onClick: () => dispatch(requestClustering(props.scheme)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clustering);
