import React from 'react';

export function undoMoveToBin(total, binned, onClick) {
  return {
    action: {
      label: 'Undo',
      onClick,
    },
    message: (
      <span>
        <strong>{total} genome{total === 1 ? '' : 's'}</strong>&nbsp;
        {binned ? 'restored from' : 'moved to'} bin.
      </span>
    ),
  };
}

export function notifyDuplicates(duplicates) {
  return {
    message: duplicates.length === 1 ? (
      <span><strong>{duplicates[0].name}</strong> is a duplicate and was not queued.</span>
    ) : (
      <span>{duplicates.length} duplicates were not queued.</span>
    ),
  };
}
