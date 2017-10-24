import React from 'react';
import classnames from 'classnames';

const Switch = ({ id, checked, onChange, children, lhs = false }) => (
  <label className="wgsa-settings-switch">
    {!lhs && children}
    <span className={classnames('mdl-switch', { 'is-checked': checked })}>
      <input type="checkbox" id={id} className="mdl-switch__input"
        value={checked} onChange={() => onChange(!checked)}
      />
      <span className="mdl-switch__track" />
      <span className="mdl-switch__thumb">
        <span className="mdl-switch___focus-helper" />
      </span>
    </span>
    {lhs && children}
  </label>
);

Switch.displayName = 'Switch';

Switch.propTypes = {
  left: PropTypes.object,
  right: PropTypes.object,
  id: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Switch;
