import './styles.css';

import React from 'react';
import SplitPane from 'react-split-pane';
import { AutoSizer } from 'react-virtualized';
import { connect } from 'react-redux';

import Tree from '../tree';
import Map from '../map';
import Summary from '../summary';
import Table from '../table';

import { getVisibleTree } from '../tree/selectors';

const Layout = React.createClass({

  getInitialState() {
    return {
      horizontalSize: 0,
      verticalSize: 0,
    };
  },

  renderNorthSection() {
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
        <Tree />
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
    showTree: getVisibleTree(state) !== null,
  };
}

export default connect(mapStateToProps)(Layout);
