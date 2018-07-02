import React from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import dateSince from 'date-fns/distance_in_words';

import Card, { CardMetadata } from '../card';
import { FormattedName } from '../organisms';
import PubMedLink from '../components/PubMedLink.react';
import RemoveButton from './RemoveButton.react';
import MarkdownHeading from '../components/MarkdownHeading.react';

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

function getFooterLink(collection) {
  if (collection.owner === 'other') {
    return (
      <PubMedLink
        className="mdl-button wgsa-button--text"
        pmid={collection.pmid}
      />
    );
  }
  return <RemoveButton collection={collection} />;
}

export default ({ item, footerLink }) => {
  const now = new Date();
  const { createdAt, status, size } = item;
  return (
    <Card className="wgsa-card--bordered">
      <span className="wgsa-card-metadata-overview">
        <CardMetadata title="Size" icon="wgsa_genome">
          {size} genome{size === 1 ? '' : 's'}
        </CardMetadata>
        <CardMetadata tooltip={createdAt.toLocaleString()} icon="access_time">
          {dateSince(createdAt, now)} ago
        </CardMetadata>
        { status !== 'READY' &&
          <CardMetadata title="Status" icon={statusIcons[status]}>
            {statusText[status]}
          </CardMetadata>
        }
      </span>
      { item.title ?
        <MarkdownHeading
          level="2"
          className="wgsa-card-title wgsa-overflow-fade"
        >
          {item.title}
        </MarkdownHeading> :
        <h2 className="wgsa-card-title">{'(Untitled Collection)'}</h2>
      }
      <p className="wgsa-card-subtitle">
        <FormattedName organismId={item.organismId} fullName />
      </p>
      { item.description ?
        <Markdown className="wgsa-card-description" source={item.description} /> :
        <p>(no description)</p>
      }
      <div className="wgsa-card-footer wgsa-card-footer--fixed">
        <Link
          className="mdl-button mdl-button--primary wgsa-button--text"
          to={`/collection/${item.token}`}
        >
          View Collection
        </Link>
        { footerLink || getFooterLink(item) }
      </div>
    </Card>
  );
};
