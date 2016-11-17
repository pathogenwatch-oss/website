import './styles.css';

import React from 'react';

import SplitPane from 'react-split-pane';
import { AutoSizer } from 'react-virtualized';

import WestContent from './WestContent.react';
import Map from '../map';
import Summary from '../summary';
import Table from '../table';

export default React.createClass({

  displayName: 'Layout',

  getInitialState() {
    return {
      horizontalSize: 0,
      verticalSize: 0,
    };
  },

  render() {
    return (
      <SplitPane
        split="horizontal"
        defaultSize="68%"
        resizerClassName="wgsa-resizer"
        onChange={(horizontalSize) => this.setState({ horizontalSize })}
      >
        <SplitPane
          split="vertical"
          defaultSize="50%"
          className="wgsa-no-overflow-pane"
          resizerClassName="wgsa-resizer"
          onChange={(verticalSize) => this.setState({ verticalSize })}
        >
          <WestContent height={this.state.horizontalSize} width={this.state.verticalSize} />
          <div>
            <Map />
            <Summary />
          </div>
        </SplitPane>
        <AutoSizer>
          {({ height, width }) =>
            <Table height={height} width={width} />
          }
        </AutoSizer>
      </SplitPane>
    );
  },

});
