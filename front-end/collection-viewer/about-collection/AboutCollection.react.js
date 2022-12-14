import React from 'react';
import Markdown from 'react-markdown';
import dateSince from 'date-fns/distance_in_words';
import Menu from '@cgps/libmicroreact/menu';
import IconButton from '@cgps/libmicroreact/icon-button';

import { CardMetadata } from '~/card';
import Access from '../access';
import MarkdownHeading from '~/components/MarkdownHeading.react';
import LiteratureLink from '~/components/LiteratureLink.react';
import SaveForOffline from '../offline';
import * as PropTypes from 'prop-types';

LiteratureLink.propTypes = { children: PropTypes.node };
export default ({ organism, metadata, isOpen, onButtonClick }) => (
  <Menu
    align="right"
    button={
      <IconButton title="About collection">
        <i className="material-icons">info</i>
      </IconButton>
    }
    caret
    className="wgsa-about-collection-dropdown"
    open={isOpen}
    toggle={onButtonClick}
    toggleOnClick={false}
  >
    <MarkdownHeading
      className="wgsa-about-collection-dropdown__title"
      level="3"
    >
      {metadata.title || 'About Collection'}
    </MarkdownHeading>
    <p className="wgsa-card-metadata-inliner">
      <CardMetadata title="Organism" icon="bug_report">
        {typeof organism !== 'undefined' ? organism : metadata.organismName}
      </CardMetadata>
      <CardMetadata tooltip={metadata.dateCreated.toLocaleDateString()} icon="access_time">
        {dateSince(metadata.dateCreated, new Date())} ago
      </CardMetadata>
    </p>
    {metadata.description ?
      <Markdown source={metadata.description} /> :
      <p>(no description)</p>}
    {metadata.literatureLink && metadata.literatureLink.value &&
      <p className="pw-append-icon">
        <LiteratureLink
          linkTarget={metadata.literatureLink.value}
          linkType={metadata.literatureLink.type}
        />
        <i className="material-icons">launch</i>
      </p>}
    {metadata.owner === 'me' && <hr />}
    {metadata.owner === 'me' && <Access access={metadata.access} />}
    <hr />
    <SaveForOffline />
  </Menu>
);
