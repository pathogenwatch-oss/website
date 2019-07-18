import React from 'react';
import Markdown from 'react-markdown';
import dateSince from 'date-fns/distance_in_words';
import Menu from 'libmicroreact/menu';

import { CardMetadata } from '~/card';
import Access from '../access';
import MarkdownHeading from '~/components/MarkdownHeading.react';
import PubMedLink from '~/components/PubMedLink.react';
import SaveForOffline from '../offline';

class Button extends React.Component {
  render() {
    return (
      <button
        className="mdl-button mdl-button--icon"
        onClick={this.props.onClick}
        ref={el => { this.el = el; }}
        title="About Collection"
      >
        <i className="material-icons">info</i>
      </button>
    );
  }
}

export default ({ organism, metadata, isOpen, onButtonClick }) => (
  <Menu
    align="right"
    button={<Button />}
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
      { metadata.title || 'About Collection' }
    </MarkdownHeading>
    <p className="wgsa-card-metadata-inliner">
      <CardMetadata title="Organism" icon="bug_report">
        {organism}
      </CardMetadata>
      <CardMetadata tooltip={metadata.dateCreated.toLocaleDateString()} icon="access_time">
        {dateSince(metadata.dateCreated, new Date())} ago
      </CardMetadata>
    </p>
    { metadata.description ?
      <Markdown source={metadata.description} /> :
      <p>(no description)</p> }
    { metadata.pmid &&
        <p className="pw-append-icon">
          <PubMedLink pmid={metadata.pmid}>
            View Publication
          </PubMedLink>
          <i className="material-icons">launch</i>
        </p> }
    { metadata.owner === 'me' && <hr /> }
    { metadata.owner === 'me' && <Access access={metadata.access} /> }
    <hr />
    <SaveForOffline />
  </Menu>
);
