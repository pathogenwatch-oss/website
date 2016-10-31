import '../../css/layout-resizer.css';

import React from 'react';

import SplitPane from 'react-split-pane';
import { AutoSizer } from 'react-virtualized';

import WestContent from './WestContent.react';
import EastContent from './EastContent.react';
import SouthContent from './SouthContent.react';

export default () => (
  <SplitPane
    split="horizontal"
    defaultSize="68%"
    resizerClassName="wgsa-resizer"
  >
    <SplitPane
      split="vertical"
      defaultSize="33.4%"
      resizerClassName="wgsa-resizer"
    >
      <WestContent />
      <EastContent />
    </SplitPane>
    <AutoSizer>
      {({ height, width }) => <SouthContent height={height} width={width} />}
    </AutoSizer>
  </SplitPane>
);
