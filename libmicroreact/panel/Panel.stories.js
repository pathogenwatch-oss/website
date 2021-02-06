import './Panel.stories.css';

import React from 'react';

import Panel from './index';

import AutoSizer from '../auto-sizer';
import ControlsButton from '../controls-button';
import ControlsMenu from '../controls-menu';

export default {
  title: 'Core/Panel',
  decorators: [ story => <AutoSizer component={story} /> ],
};

export const Default = ({ width, height }) => (
  <Panel
    className="story-panel"
    style={{ width, height }}
    primaryControls={<p>Primary controls</p>}
    secondaryControls={<p>Secondary controls</p>}
  />
);

export const WithControlGroups = ({ width, height }) => (
  <Panel
    className="story-panel"
    style={{ width, height }}
    primaryControls={
      <>
        <ControlsButton>
          <i className="material-icons">looks_one</i>
        </ControlsButton>
        <div className="libmr-Panel-control-group">
          <ControlsMenu active={false} summary="Two" />
          <ControlsMenu active={false} summary="Three" />
        </div>
        <div className="libmr-Panel-control-group">
          <ControlsMenu active={false} summary="Four" />
        </div>
      </>
    }
    secondaryControls={
      <>
        <ControlsButton>
          <i className="material-icons">looks_one</i>
        </ControlsButton>
        <div className="libmr-Panel-control-group">
          <ControlsButton>
            <i className="material-icons">looks_two</i>
          </ControlsButton>
          <ControlsButton>
            <i className="material-icons">looks_3</i>
          </ControlsButton>
        </div>
        <div className="libmr-Panel-control-group">
          <ControlsButton>
            <i className="material-icons">looks_4</i>
          </ControlsButton>
          <ControlsButton>
            <i className="material-icons">looks_5</i>
          </ControlsButton>
          <ControlsButton>
            <i className="material-icons">looks_6</i>
          </ControlsButton>
        </div>
      </>
    }
  />
);
