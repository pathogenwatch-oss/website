import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { setProgressView } from './actions';

import { views } from '../constants';

const Button = ({ active, children, onClick }) => (
  <button
    className={classnames('wgsa-section-title', { active })}
    onClick={onClick}
  >
    {children}
  </button>
);

const Switcher = ({ view, setView }) => (
  <header className="wgsa-upload-progress-switcher">
    <Button
      active={view === views.ASSEMBLY}
      onClick={() => setView(views.ASSEMBLY)}
    >
      Assembly
    </Button>
    |
    <Button
      active={view === views.ANALYSIS}
      onClick={() => setView(views.ANALYSIS)}
    >
      Analysis
    </Button>
  </header>
);

function mapDispatchToProps(dispatch) {
  return {
    setView: view => dispatch(setProgressView(view)),
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Switcher);
