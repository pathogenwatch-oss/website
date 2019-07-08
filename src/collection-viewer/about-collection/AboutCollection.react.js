import React from 'react';
import classnames from 'classnames';
import Markdown from 'react-markdown';
import dateSince from 'date-fns/distance_in_words';

import SaveForOffline from '../offline';
import PubMedLink from '~/components/PubMedLink.react';
import MarkdownHeading from '~/components/MarkdownHeading.react';
import Access from '../access';
import { CardMetadata } from '~/card';

export default ({ organism, metadata, isOpen, onButtonClick }) => (
  <div
    className={classnames(
      'wgsa-about-collection-dropdown',
      'wgsa-header-dropdown wgsa-header-dropdown--right',
      { 'wgsa-header-dropdown--is-open': isOpen }
    )}
  >
    <button
      className="mdl-button mdl-button--icon"
      title="About Collection"
      onClick={onButtonClick}
    >
      <i className="material-icons">info</i>
    </button>
    <div className="wgsa-header-dropdown__content">
      <MarkdownHeading
        className="wgsa-about-collection-dropdown__title"
        level="3"
      >
        { metadata.title || 'About Collection' }
      </MarkdownHeading>
      <span className="wgsa-card-metadata-inliner wgsa-collection-summary">
        <CardMetadata title="Organism" icon="bug_report">
          {organism}
        </CardMetadata>
        <CardMetadata tooltip={metadata.dateCreated.toLocaleString()} icon="access_time">
          {dateSince(metadata.dateCreated, new Date())} ago
        </CardMetadata>
      </span>
      { metadata.description ?
        <Markdown source={metadata.description} /> :
        <p>(no description)</p> }
      { metadata.pmid &&
        <p>
          <PubMedLink pmid={metadata.pmid}>
            View Publication
          </PubMedLink>
        </p> }
      { metadata.owner === 'me' && <hr /> }
      { metadata.owner === 'me' && <Access access={metadata.access} /> }
      <hr />
      <SaveForOffline />
    </div>
  </div>
);
