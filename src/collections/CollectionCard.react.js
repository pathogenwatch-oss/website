import React from 'react';
import { Link } from 'react-router';
import Markdown from 'react-markdown';

import Card, { CardMetadata } from '../card';

import { taxIdMap } from '../species';

const renderers = {
  Paragraph: (props) => <span>{props.children}</span>,
};

export default ({ title, description, link, pubmedLink, size, species }) => (
  <Card>
    <Markdown containerTagName="h2" className="wgsa-card-title" source={title} renderers={renderers} />
    <span className="wgsa-card-metadata-inliner">
      <CardMetadata title="Species" icon="bug_report">
        {taxIdMap.get(species).formattedShortName}
      </CardMetadata>
      <CardMetadata icon="insert_drive_file">
        {size} genomes
      </CardMetadata>
    </span>
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
