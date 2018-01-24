import React from 'react';
import classnames from 'classnames';
import Markdown from 'react-markdown';

import SaveForOffline from '../offline';
import PubMedLink from '../../components/PubMedLink.react';
import MarkdownHeading from '../../components/MarkdownHeading.react';
import Access from '../access';

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
      { metadata.description ?
          <Markdown source={metadata.description} /> :
          <p>(no description)</p> }
      { metadata.pmid &&
        <p>
          <PubMedLink pmid={metadata.pmid}>
            View Publication
          </PubMedLink>
        </p> }
      <dl>
        <div>
          <dt className="wgsa-hub-stats-heading">Organism</dt>
          <dd className="wgsa-hub-stats-value">{organism}</dd>
        </div>
        <div>
          <dt className="wgsa-hub-stats-heading">Created</dt>
          <dd className="wgsa-hub-stats-value">{metadata.dateCreated}</dd>
        </div>
      </dl>
      { metadata.owner === 'me' && <hr /> }
      { metadata.owner === 'me' && <Access access={metadata.access} /> }
      <hr />
      <SaveForOffline />
    </div>
  </div>
);
