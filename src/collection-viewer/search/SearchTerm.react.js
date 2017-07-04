import React from 'react';
import classnames from 'classnames';

export default ({ category, value, action }) => (
  <span
    className={classnames(
      'mdl-chip mdl-chip--deletable',
      { 'mdl-chip--alt': category && value }
    )}
  >
    <span className="mdl-chip__text">
      <small>{category.label}{value && ':'}&nbsp;</small>
      { value && <strong>{value.label}</strong>}
    </span>
    <button className="mdl-chip__action" onClick={action} title="Remove">
      <i className="material-icons">cancel</i>
    </button>
  </span>
);
