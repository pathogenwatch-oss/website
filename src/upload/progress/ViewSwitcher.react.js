import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { hasReads } from './selectors';

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

const Switcher = ({ view, setView, sessionHasReads }) =>
  (sessionHasReads ? (
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
  ) : (
    <h2 className="wgsa-section-title">Analysis</h2>
  ));

function mapStateToProps(state) {
  return {
    sessionHasReads: hasReads(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setView: view => dispatch(setProgressView(view)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Switcher);
