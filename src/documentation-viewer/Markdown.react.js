import './styles.css';

import React from 'react';
import Markdown from 'react-markdown';
import { Link } from 'react-router';

import Breadcrumb from '../components/Breadcrumb.react';

function rewriteMarkdown(markdown) {
  return markdown.replace(
    /\[\[([^\]]+)\]\]/g,
    (a, b) => `[${b}](/documentation/${b.replace(/ /g, '-')})`
  );
}

const renderers = {
  Link: ({ href, title = '', children }) => {
    if (href.indexOf('/') === 0) {
      return (
        <Link to={href}>{children}</Link>
      );
    }
    return (
      <a href={href} title={title}>
        {children}
      </a>
    );
  },
};

export default ({ page, markdown }) => (
  <div className="wgsa-wiki-page wgsa-page">
    { page ?
      <Breadcrumb>
        <Link to="/documentation">Documentation Home</Link>
        {page}
      </Breadcrumb> :
      null
    }
    <Markdown
      source={rewriteMarkdown(markdown)}
      renderers={renderers}
    />
  </div>
);
