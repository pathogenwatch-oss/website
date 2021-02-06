import React from 'react';

import AutoSizer from './index';

export default {
  title: 'Layout/AutoSizer',
};

export const Default = () => (
  <AutoSizer>
    {({ width, height }) => (
      <div style={{ width, height }}>
        width: {width}px height: {height}px
      </div>
    )}
  </AutoSizer>
);

Default.story = {
  name: 'default',
};
