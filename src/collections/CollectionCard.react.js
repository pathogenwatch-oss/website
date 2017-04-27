import React from 'react';
import { Link } from 'react-router';
import Markdown from 'react-markdown';
import dateSince from 'date-fns/distance_in_words';

import Card, { CardMetadata } from '../card';
import { FormattedName } from '../organisms';
import PubMedLink from '../components/PubMedLink.react';

const renderers = {
  Paragraph: (props) => <span>{props.children}</span>,
};

const statusIcons = {
  READY: 'done',
  PROCESSING: 'hourglass_empty',
  FAILED: 'warning',
};

const statusText = {
  READY: 'Ready',
  PROCESSING: 'In progress',
  FAILED: 'Failed',
};

export default ({ item }) => {
  const now = new Date();
  const { createdAt, status, size } = item;
  return (
    <Card className="wgsa-card--bordered">
      <span className="wgsa-card-metadata-overview">
        <CardMetadata title="Size" icon="insert_drive_file">
          {size} genome{size === 1 ? '' : 's'}
        </CardMetadata>
        <CardMetadata tooltip={createdAt.toLocaleString()} icon="history">
          {dateSince(createdAt, now)} ago
        </CardMetadata>
        { status !== 'READY' &&
          <CardMetadata title="Status" icon={statusIcons[status]}>
            {statusText[status]}
          </CardMetadata>
        }
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
        <PubMedLink
          className="mdl-button wgsa-button--text"
          pmid={item.pmid}
        />
      </div>
    </Card>
  );
};
