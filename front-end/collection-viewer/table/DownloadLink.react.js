import React from 'react';

export default ({ action, title, ids, children }) => (
  <form
    action={action}
    method="POST"
    target="_blank"
    style={{ display: 'inline' }}
  >
    <button
      title={title}
      className="wgsa-download-button mdl-button mdl-button--icon"
    >
      {children}
    </button>
    <input type="hidden" name="ids" value={ids} />
  </form>
);
