import React from 'react';
import { Link } from 'react-router';
import Markdown from 'react-markdown';
import dateSince from 'date-since';

import Card, { CardMetadata } from '../card';
import { FormattedName } from '../organisms';

const renderers = {
  Paragraph: (props) => <span>{props.children}</span>,
};

export default ({ item }) => (
  <Card>
    <span className="wgsa-card-metadata-overview">
      <CardMetadata icon="insert_drive_file">
        {item.size} genomes
      </CardMetadata>
      <CardMetadata title="Created" icon="history">
        {dateSince(new Date(item.createdAt))} ago
      </CardMetadata>
    </span>
    { item.title ?
      <Markdown containerTagName="h2" className="wgsa-card-title" source={item.title} renderers={renderers} /> :
      <h2 className="wgsa-card-title">{'(Untitled Collection)'}</h2>
    }
    <p className="wgsa-card-subtitle">
      <FormattedName organismId={item.organismId} fullName />
    </p>
    { item.description ?
      <Markdown source={item.description} /> :
      <p>(no description)</p>
    }
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
