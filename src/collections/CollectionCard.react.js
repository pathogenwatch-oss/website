import React from 'react';
import { Link } from 'react-router';
import Markdown from 'react-markdown';
import dateSince from 'date-since';

import Card, { CardMetadata } from '../card';
import { FormattedName } from '../organisms';

const renderers = {
  Paragraph: (props) => <span>{props.children}</span>,
};

export default ({ item }) => {
  const createdAt = new Date(item.createdAt);
  const { status } = item;
  return (
    <Card className="wgsa-card--bordered">
      <span className="wgsa-card-metadata-overview">
        <CardMetadata title="Size" icon="insert_drive_file">
          {item.size} genomes
        </CardMetadata>
        <CardMetadata tooltip={createdAt.toLocaleString()} icon="history">
          {dateSince(createdAt)} ago
        </CardMetadata>
      </span>
      { item.title ?
        <Markdown containerTagName="h2" className="wgsa-card-title wgsa-overflow-fade" source={item.title} renderers={renderers} /> :
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
        { item.pmid &&
          <a
            className="mdl-button wgsa-button--text"
            href={`http://www.ncbi.nlm.nih.gov/pubmed/${item.pmid}`}
            target="_blank"
            rel="noopener"
            title="View Publication"
          >
            Pubmed
          </a>
        }
      </div>
    </Card>
  );
};
