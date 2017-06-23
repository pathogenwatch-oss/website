import React from 'react';

export function undoMoveToBin({ title, binned }, onClick) {
  return {
    action: {
      label: 'Undo',
      onClick,
    },
    message: (
      <span>
        {title ? <strong>{title}</strong> : 'Collection'}&nbsp;
        {binned ? 'restored' : 'moved to bin'}.
      </span>
    ),
  };
}
