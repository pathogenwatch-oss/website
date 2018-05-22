import './styles.css';

import React from 'react';
import SplitPane from 'react-split-pane';
import { AutoSizer } from 'react-virtualized';
import { connect } from 'react-redux';

import Tree from '../tree';
import TreeProgress from '../tree/Progress.react';
import Map from '../map';
import Summary from '../summary';
import Table from '../table';

import { getVisibleTree, hasTrees } from '../tree/selectors';
import { getCollection } from '../selectors';

const Layout = React.createClass({

  getInitialState() {
    return {
      horizontalSize: 0,
      verticalSize: 0,
    };
  },

  renderNorthSection() {
    if (this.props.treeNeverComing) {
      return (
        <Map>
          <Summary />
          {/* <ThresholdChart /> */}
        </Map>
      );
    }

    if (this.props.showTree) {
      return (
        <SplitPane
          split="vertical"
          defaultSize="50%"
          className="wgsa-no-overflow-pane"
          resizerClassName="wgsa-resizer"
          onChange={(verticalSize) => this.setState({ verticalSize })}
        >
          <Tree
            height={this.state.horizontalSize}
            width={this.state.verticalSize}
          />
          <Map>
            <Summary />
          </Map>
        </SplitPane>
      );
    }

    return (
      <Map>
        <Summary />
        <TreeProgress date={this.props.createdAt} />
      </Map>
    );
  },

  render() {
    return (
      <SplitPane
        split="horizontal"
        defaultSize="68%"
        resizerClassName="wgsa-resizer"
        onChange={(horizontalSize) => this.setState({ horizontalSize })}
      >
        { this.renderNorthSection() }
        <AutoSizer>
          { ({ height, width }) => <Table height={height} width={width} /> }
        </AutoSizer>
      </SplitPane>
    );
  },

});

function mapStateToProps(state) {
  return {
    treeNeverComing: !hasTrees(state),
    showTree: getVisibleTree(state) !== null,
    createdAt: getCollection(state).createdAt,
  };
}

export default connect(mapStateToProps)(Layout);
