import React from 'react';
import Markdown from 'react-markdown';

const renderers = {
  Paragraph: props => <span>{props.children}</span>,
};

export default ({ className, level = '1', children }) => (
  <Markdown
    className={className}
    containerTagName={`h${level}`}
    source={children}
    renderers={renderers}
  />
);
