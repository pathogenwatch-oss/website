import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Spinner from '../../../components/Spinner.react';
import Notify from '../../../components/Notify.react';
import { getClusteringStatus, getClusteringProgress, getClusters } from '../selectors';
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
                  <p>Running ({this.props.progress.toFixed(1)}%)</p><Spinner />
                </Notify>
              );
            case 'COMPLETE': {
              const { clusters, genomeId } = this.props;
              const thresholds = Object.keys(clusters).map(t => parseInt(t));
              thresholds.sort((a, b) => a - b);
              const bullets = thresholds.map(t => {
                const clusterSize = (clusters[t] || {}).length;
                const others = clusterSize <= 1 ? 0 : clusterSize - 1;
                if (others < 1) return <li key={t}>No cluster found at threshold { t }</li>;
                return <li key={t}><Link to={`/clustering/${genomeId}?threshold=${t}`}>{ others } other genome{ others !== 1 ? 's' : ''}</Link> at threshold { t }</li>;
              });
              return <React.Fragment><p>Found in clusters with:</p><ul>{ bullets }</ul></React.Fragment>;
            }
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
    progress: getClusteringProgress(state),
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
