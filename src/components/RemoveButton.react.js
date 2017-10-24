import React from 'react';
import classnames from 'classnames';

export default ({ moveToBin, restoreFromBin, primary, className, item = {} }) => {
  if (item.owner !== 'me') return null;

  if (item.binned) {
    return (
      <button
        className="mdl-button wgsa-button--text"
        onClick={restoreFromBin}
        title="Restore from Bin"
      >
        Restore
      </button>
    );
  }

  return primary ? (
    <button
      className="mdl-button mdl-button--primary wgsa-button--text"
      onClick={moveToBin}
      title="Move to Bin"
    >
      Move to Bin
    </button>
  ) : (
    <button
      className={classnames('mdl-button mdl-button--icon', className)}
      onClick={moveToBin}
      title="Move to Bin"
    >
      <i className="material-icons">delete</i>
    </button>
  );
};
