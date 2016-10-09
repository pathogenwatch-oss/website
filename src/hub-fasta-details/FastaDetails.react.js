import React from 'react';

export default ({ isOpen, fasta = {} }) => (
  <div className={`wgsa-overlay ${isOpen ? 'wgsa-overlay--is-visible' : ''}`.trim()}>
    <div className="wgsa-overlay__content wgsa-downloads-menu mdl-shadow--4dp" onClick={e => e.stopPropagation()}>
      <h3 className="mdl-dialog__title">Test</h3>
    </div>
  </div>
);
