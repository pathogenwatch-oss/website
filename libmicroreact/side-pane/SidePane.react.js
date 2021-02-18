import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Animate from 'rc-animate';

import IconButton from '../icon-button';
import ControlsButton from '../controls-button';

const PanePropTypes = {
  icon: PropTypes.node,
  component: PropTypes.elementType,
  title: PropTypes.string,
};

const SidePane = ({ children, className, navStyle, panes, style }) => {
  const [ activePane, setActivePane ] = React.useState(null);
  const [ open, setOpened ] = React.useState(false);
  const active = activePane !== null;
  return (
    <div className={classnames('libmr-SidePane', { active, open }, className)} style={style}>
      <div className="libmr-SidePane-main">
        {children}
      </div>
      <Animate transitionName="libmr-SidePane" onEnd={() => setOpened(active)}>
        {active &&
          <aside key="aside" className="libmr-SidePane-aside">
            <IconButton
              className="libmr-SidePane-close"
              onClick={() => setActivePane(null)}
              title="Close"
            >
              <i className="material-icons">close</i>
            </IconButton>
            <div className="libmr-SidePane-contents">
              {panes[activePane].title && <h3 className="libmr-SidePane-title">{panes[activePane].title}</h3>}
              <div className="libmr-SidePane-contents-overflow">
                {React.createElement(panes[activePane].component)}
              </div>
            </div>
          </aside>}
      </Animate>
      <nav className="libmr-SidePane-nav" style={navStyle}>
        {panes.map(({ icon }, index) => (
          <ControlsButton
            key={index}
            active={activePane === index}
            onClick={() => setActivePane(activePane === index ? null : index)}
          >
            {icon}
          </ControlsButton>
        ))}
      </nav>
    </div>
  );
};

SidePane.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  navStyle: PropTypes.object,
  panes: PropTypes.arrayOf(PropTypes.shape(PanePropTypes)),
  style: PropTypes.object,
};

export default SidePane;
