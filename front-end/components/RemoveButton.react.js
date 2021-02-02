import React from 'react';
import classnames from 'classnames';

export default ({ moveToBin, restoreFromBin, primary, className, item = {} }) => {
  if (item.owner !== 'me') return null;

  if (item.binned) {
    return (
      <button
        className="mdl-button mdl-button--icon"
        onClick={restoreFromBin}
        title="Restore from bin"
      >
        <i className="material-icons">restore</i>
      </button>
    );
  }

  return primary ? (
    <button
      className="mdl-button mdl-button--primary wgsa-button--text"
      onClick={moveToBin}
      title="Move to bin"
    >
      Move to Bin
    </button>
  ) : (
    <button
      className={classnames('mdl-button mdl-button--icon', className)}
      onClick={moveToBin}
      title="Move to bin"
    >
      <i className="material-icons">delete</i>
    </button>
  );
};
