import './styles.css';

import React from 'react';

import SplitPane from 'react-split-pane';
import { AutoSizer } from 'react-virtualized';

import WestContent from './WestContent.react';
import EastContent from './EastContent.react';
import SouthContent from './SouthContent.react';

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
          defaultSize="33.4%"
          className="wgsa-no-overflow-pane"
          resizerClassName="wgsa-resizer"
          onChange={(verticalSize) => this.setState({ verticalSize })}
        >
          <WestContent height={this.state.horizontalSize} width={this.state.verticalSize} />
          <EastContent />
        </SplitPane>
        <AutoSizer>
          {({ height, width }) =>
            // <div />
            <SouthContent height={height} width={width} />
          }
        </AutoSizer>
      </SplitPane>
    );
  },

});
