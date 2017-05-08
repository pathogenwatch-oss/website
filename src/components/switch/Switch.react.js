import React from 'react';
import classnames from 'classnames';

const Switch = ({ id, checked, onChange, children }) => (
  <label className="wgsa-settings-switch">
    {children}
    <span className={classnames('mdl-switch', { 'is-checked': checked })}>
      <input type="checkbox" id={id} className="mdl-switch__input"
        value={checked} onChange={() => onChange(!checked)}
      />
      <span className="mdl-switch__track" />
      <span className="mdl-switch__thumb">
        <span className="mdl-switch___focus-helper" />
      </span>
    </span>
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
