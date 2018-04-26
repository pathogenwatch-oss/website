import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { changeAccessLevel } from './actions';
import { getAccessLevel } from './selectors';

const AccessLevel = ({ onClick, icon, active, title, description }) => (
  <button
    className={classnames({ active })}
    title={`Set Access to ${title}`}
    onClick={onClick}
    disabled={active}
  >
    <i className="material-icons">{icon}</i>
    <div>
      <strong>{title}</strong>
      <br />
      {description}
    </div>
  </button>
);

function mapStateToProps(state, { level }) {
  return {
    active: getAccessLevel(state) === level,
  };
}

function mapDispatchToProps(dispatch, { level }) {
  return {
    onClick: () => dispatch(changeAccessLevel(level)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccessLevel);
