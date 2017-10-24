import React from 'react';

import MarkdownInline from './MarkdownInline.react';

export default ({ className, level = '1', children }) => (
  <MarkdownInline
    className={className}
    tag={`h${level}`}
  >
    {children}
  </MarkdownInline>
);
