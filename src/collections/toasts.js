import React from 'react';

import MarkdownInline from '../components/MarkdownInline.react';

export function undoMoveToBin({ title, binned }, onClick) {
  return {
    action: {
      label: 'Undo',
      onClick,
    },
    message: (
      <span>
        {title ? <MarkdownInline tag="strong">{title}</MarkdownInline> : 'Collection'}&nbsp;
        {binned ? 'restored' : 'moved to bin'}.
      </span>
    ),
  };
}
