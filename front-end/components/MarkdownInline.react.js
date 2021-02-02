import React from 'react';
import Markdown from 'react-markdown';

const renderers = {
  Paragraph: props => <span>{props.children}</span>,
};

export default ({ className, tag, children }) => (
  <Markdown
    className={className}
    containerTagName={tag}
    source={children}
    renderers={renderers}
  />
);
