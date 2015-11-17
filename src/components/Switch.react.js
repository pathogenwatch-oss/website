import '../css/switch.css';

import React from 'react';

const Switch = ({ left, right, id, checked, onChange }) => (
  <label className="wgsa-switch" htmlFor={id}>
    <i className={`material-icons ${checked ? '' : 'active'}`}
      title={left.title}>
      {left.icon}
    </i>
    <span className={`mdl-switch ${checked ? 'is-checked' : ''}`.trim()}>
      <input type="checkbox" id={id} className="mdl-switch__input"
        value={checked} onChange={() => onChange(!checked)} />
      <div className="mdl-switch__track" />
      <div className="mdl-switch__thumb">
        <span className="mdl-switch___focus-helper" />
      </div>
    </span>
    <i className={`material-icons ${checked ? 'active' : ''}`}
      title={right.title}>
      {right.icon}
    </i>
  </label>
);

Switch.displayName = 'Switch';

Switch.propTypes = {
  left: React.PropTypes.object,
  right: React.PropTypes.object,
  id: React.PropTypes.string,
  checked: React.PropTypes.bool,
  onChange: React.PropTypes.func,
};

export default Switch;
