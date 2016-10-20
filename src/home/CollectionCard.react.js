import React from 'react';
import { Link } from 'react-router';
import Markdown from 'react-markdown';

import Card from '../card';

const renderers = {
  Paragraph: (props) => <span>{props.children}</span>,
};

export default ({ title, description, link, pubmedLink }) => (
  <Card>
    <Markdown containerTagName="h2" className="wgsa-card-title" source={title} renderers={renderers} />
    <Markdown source={description} />
    <div className="wgsa-card-footer">
      <Link
        className="mdl-button mdl-button--primary wgsa-button--text"
        to={link}
      >
        View Collection
      </Link>
      { pubmedLink && <a className="mdl-button wgsa-button--text" href={pubmedLink} target="_blank" rel="noopener">Pubmed</a>}
    </div>
  </Card>
);
