import '../../css/layout-resizer.css';

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
      layoutWestWidth: 0,
      layoutEastWidth: 0,
      layoutNorthHeight: 0,
      horizontalSize: 0,
      verticalSize: 0,
    };
  },

  render() {
    return (
      <SplitPane
        split="horizontal"
        defaultSize="68%"
        onChange={horizontalSize => this.setState({ horizontalSize })}
        onDragFinished={() =>
          this.setState({
            layoutNorthHeight: this.state.horizontalSize,
          })
        }
        resizerClassName="wgsa-resizer"
      >
        <SplitPane
          split="vertical"
          defaultSize="33.4%"
          onChange={verticalSize => this.setState({ verticalSize })}
          onDragFinished={() =>
            this.setState({
              layoutWestWidth: this.state.verticalSize,
              layoutEastWidth: this.state.verticalSize,
            })
          }
          resizerClassName="wgsa-resizer"
        >
          <WestContent
          />
          <EastContent
          />
        </SplitPane>
        <AutoSizer>
          {({ height, width }) => <SouthContent height={height} width={width} />}
        </AutoSizer>
      </SplitPane>
    );
  },

});
