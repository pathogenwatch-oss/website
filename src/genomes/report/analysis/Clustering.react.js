import React from 'react';
import { connect } from 'react-redux';

import Spinner from '../../../components/Spinner.react';
import Notify from '../../../components/Notify.react';
import { getClusteringStatus, getClusters } from '../selectors';
import { requestClustering, updateClusteringProgress, fetchClusters } from '../actions';

const Clustering = React.createClass({

  componentDidUpdate() {
    const { status } = this.props;
    if (status === 'READY') {
      this.props.fetchClusters();
    }
  },

  render() {
    return (
      <React.Fragment>
        <h2>Clustering</h2>
        {(() => {
          switch (this.props.status) {
            case 'ERROR':
              return <p>Something went wrong :(</p>;
            case 'LOADING':
            case 'PENDING':
            case 'IN PROGRESS':
            case 'READY':
              return (
                <Notify topic="clustering" onMessage={this.props.updateProgress}>
                  <p>Running</p><Spinner />
                </Notify>
              );
            case 'COMPLETE':
              return <p>Found loads of clusters: { JSON.stringify(Object.keys(this.props.clusters)) }</p>;
            default:
              return (
                <React.Fragment>
                  <p>Clusters have not yet been determined for this genome.</p>
                  <button
                    className="mdl-button mdl-button--raised mdl-button--colored"
                    onClick={this.props.onClick}
                  >
                    Cluster Now
                  </button>
                </React.Fragment>
              );
          }
        })()}
      </React.Fragment>
    );
  },

});

function mapStateToProps(state) {
  return {
    status: getClusteringStatus(state),
    clusters: getClusters(state),
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    updateProgress: (payload) => dispatch(updateClusteringProgress(payload)),
    fetchClusters: () => dispatch(fetchClusters(props.genomeId)),
    onClick: () => dispatch(requestClustering(props.scheme)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clustering);
