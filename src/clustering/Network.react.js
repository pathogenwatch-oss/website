import React from 'react';
import { connect } from 'react-redux';

import Network from 'libmicroreact/network';
import ClusterDescription from './ClusterDescription.react';

import * as selectors from './selectors';
import * as actions from './actions';

import * as constants from './constants';

const FetchingMessage = () => (
  <div className="pw-cluster-status">
    <p className="wgsa-blink">Fetching cluster...</p>
  </div>
);

const ErrorMessage = () => (
  <div className="pw-cluster-status">
    <p>Couldn't fetch the cluster, try another threshold</p>
  </div>
);

const ClusterNetwork = React.createClass({

  getInitialState() {
    return {
      controlsVisible: false,
    };
  },

  overNode({ data, target }) {
    data.node.label = data.node._label;
    target.supervisor.sigInst.refresh();
  },

  outNode({ data, target }) {
    if (data.node.id === `n${this.props.indexOfSelectedInCluster}`) return;
    data.node.label = undefined;
    target.supervisor.sigInst.refresh();
  },

  render() {
    switch (this.props.status) {
      case 'INITIAL_STATUS':
      case 'BUILDING_CLUSTERS':
      case 'BUILT_CLUSTERS':
      case 'FETCHING_CLUSTERS':
      case 'FETCHING_EDGES':
      case 'FETCHED_CLUSTERS':
        return <FetchingMessage />;
      case 'FETCHED_EDGES':
      case 'RUNNING_LAYOUT':
      case 'COMPLETED_LAYOUT':
        break;
      case 'FAILED_BUILDING_CLUSTERS':
      case 'FAILED_FETCHING_CLUSTERS':
      case 'FAILED_FETCHING_EDGES':
      default:
        return <ErrorMessage />;
    }


    const style = {
      opacity: this.props.status === 'RUNNING_LAYOUT' ? 0.5 : 1,
    };

    const { edgesCount } = this.props;
    const { controlsVisible } = this.state;
    return (
      <div className="pw-cluster-network">
        <Network
          style={style}
          graph={this.props.graph}
          onNodeHover={this.overNode}
          onNodeLeave={this.outNode}
          controlsVisible={controlsVisible}
          onControlsVisibleChange={() => this.setState({ controlsVisible: !controlsVisible })}
          settings={constants.NETWORK_SETTINGS}
          layoutDuration={Math.min(Math.max(1000, edgesCount / 5), 10000)}
          layoutSettings={constants.LAYOUT_OPTIONS}
          recomputeLayout={this.props.status === 'FETCHED_EDGES'}
          onLayoutStart={this.props.startLayout}
          onLayoutChange={this.props.stopLayout}
          theme="purple"
        />
        <p className="pw-network-cover-message">
          { this.props.status === 'RUNNING_LAYOUT' ?
            <span className="wgsa-blink">Rendering cluster...</span> :
            <ClusterDescription /> }
        </p>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    edgesCount: selectors.getEdgesCount(state),
    graph: selectors.getGraph(state),
    status: selectors.getStatus(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startLayout: () => dispatch(actions.startLayout()),
    stopLayout: (layout) => dispatch(actions.stopLayout(layout)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterNetwork);
