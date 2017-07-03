import React from 'react';

export default ({ category, value, action }) => (
  <span className="mdl-chip mdl-chip--deletable">
    <span className="mdl-chip__text">
      <small>{category.label}:&nbsp;</small>
      { value && <strong>{value.label}</strong>}
    </span>
    <button className="mdl-chip__action" onClick={action}>
      <i className="material-icons">cancel</i>
    </button>
  </span>
);
