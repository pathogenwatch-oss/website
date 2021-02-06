import './SidePane.stories.css';

import React from 'react';

import AutoSizer from '../auto-sizer';
import SidePane from './index';

/* https://storybook.js.org/docs/formats/component-story-format/ */

const historyPane = {
  icon: <i className="material-icons">history</i>,
  component: () => <p>history pane</p>,
};

const settingsPane = {
  icon: <i className="material-icons">remove_red_eye</i>,
  component: () => <p>settings pane</p>,
};

export default {
  title: 'Layout/Side Pane',
  decorators: [ story => <AutoSizer component={story} /> ],
};

export const SinglePane = (dimensions) => (
  <SidePane style={dimensions} panes={[ historyPane ]}>
    <main>Main content</main>
  </SidePane>
);

export const WithTitle = (dimensions) => (
  <SidePane style={dimensions} panes={[ { ...historyPane, title: 'History' } ]}>
    <main>Main content</main>
  </SidePane>
);

export const DoublePane = (dimensions) => (
  <SidePane style={dimensions} panes={[ settingsPane, historyPane ]}>
    <main>Main content</main>
  </SidePane>
);
