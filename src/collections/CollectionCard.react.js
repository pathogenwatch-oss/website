import React from 'react';
import { Link } from 'react-router';
import Markdown from 'react-markdown';

import Card, { CardMetadata } from '../card';

import { taxIdMap } from '../species';

const renderers = {
  Paragraph: (props) => <span>{props.children}</span>,
};

export default ({ item }) => (
  <Card>
    <Markdown containerTagName="h2" className="wgsa-card-title" source={item.title} renderers={renderers} />
    <span className="wgsa-card-metadata-inliner">
      <CardMetadata title="Species" icon="bug_report">
        {taxIdMap.get(item.speciesId).formattedShortName}
      </CardMetadata>
      <CardMetadata icon="insert_drive_file">
        {item.size} genomes
      </CardMetadata>
    </span>
    <Markdown source={item.description} />
    <div className="wgsa-card-footer">
      <Link
        className="mdl-button mdl-button--primary wgsa-button--text"
        to={`/collection/${item.slug}`}
      >
        View Collection
      </Link>
      { item.pubmedLink && <a className="mdl-button wgsa-button--text" href={item.pubmedLink} target="_blank" rel="noopener">Pubmed</a>}
    </div>
  </Card>
);
