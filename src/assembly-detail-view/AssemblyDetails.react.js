import React from 'react';
import classnames from 'classnames';

export default ({ assembly, closeDialog }) => (
  <div
    className={classnames(
      'wgsa-overlay',
      { 'wgsa-overlay--is-visible': assembly }
    )}
    onClick={closeDialog}
  >
    { assembly &&
      <div
        className="wgsa-overlay__content wgsa-assembly-details mdl-shadow--4dp"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="wgsa-assembly-details-title">{assembly.name}</h2>
        
      </div>
    }
  </div>
);
