import './styles.css';

import React from 'react';
import classnames from 'classnames';
import Markdown from 'react-markdown';

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
      <h4 className="wgsa-about-collection-dropdown__title">
        {metadata.title || 'About Collection'}
      </h4>
      <Markdown source={metadata.description} />
      <dl>
        <dt className="wgsa-hub-stats-heading">Organism</dt>
        <dd className="wgsa-hub-stats-value">{organism}</dd>
      </dl>
      <dl>
        <dt className="wgsa-hub-stats-heading">Created</dt>
        <dd className="wgsa-hub-stats-value">{metadata.dateCreated}</dd>
      </dl>
    </div>
  </div>
);
