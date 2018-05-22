import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Spinner from '../../../components/Spinner.react';
import { getClusteringStatus, getClusters } from '../selectors';
import { requestClustering, fetchClusters } from '../actions';

const Clustering = React.createClass({
  componentDidUpdate() {
    const { status } = this.props;
    if (status === 'READY') {
      this.props.fetchClusters();
    }
  },

  render() {
    const { status, onClick } = this.props;
    return (
      <React.Fragment>
        <h2>Clustering</h2>
        {(() => {
          switch (status) {
            case 'ERROR':
              return <p>Something went wrong :(</p>;
            case 'LOADING':
            case 'PENDING':
            case 'IN PROGRESS':
            case 'READY':
              return <React.Fragment><p>Running</p><Spinner /></React.Fragment>;
            case 'COMPLETE': {
              const { clusters, genomeId } = this.props;
              const thresholds = Object.keys(clusters).map(t => parseInt(t));
              thresholds.sort((a, b) => a - b);
              const bullets = thresholds.map(t => <li key={t}><Link to={`/clusters/${genomeId}?threshold=${t}`}>{ t }: { clusters[t].length }</Link></li>);
              return <React.Fragment><p>Found clusters:</p><ul>{ bullets }</ul></React.Fragment>;
            }
            default:
              return (<React.Fragment>
                <p>Clusters have not yet been determined for this genome.</p>
                <button
                  className="mdl-button mdl-button--raised mdl-button--colored"
                  onClick={onClick}
                >
                  Cluster Now
                </button>
              </React.Fragment>);
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
    fetchClusters: () => dispatch(fetchClusters(props.genomeId)),
    onClick: () => dispatch(requestClustering(props.scheme)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clustering);
