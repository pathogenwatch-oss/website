import React from 'react';
import classnames from 'classnames';

export default ({ active, text, contact, contactStyle, className, onClick }) => (
  <button
    title={name}
    className={classnames(
      className,
      'mdl-chip mdl-chip--contact',
      { 'mdl-chip--active': active }
    )}
    onClick={(event) => onClick(event)}
  >
    {
      contact &&
      <span className="mdl-chip__contact" style={contactStyle}>{contact}</span>
    }
    <span className="mdl-chip__text">{text}</span>
  </button>
);
