import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Markdown from 'react-markdown';

import Grid from '../grid';
import Filter from '../home-filter';
import { Summary, Totals } from '../filter-summary';

import { getVisibleCollections, getTotalCollections } from './selectors';

const renderers = {
  Paragraph: (props) => {
    return <span>{props.children}</span>;
  },
};

const CollectionCard = ({ title, description, link, pubmedLink }) => (
  <article className="wgsa-card wgsa-collection-card">
    <Markdown containerTagName="h2" className="wgsa-card-title" source={title} renderers={renderers} />
    <Markdown source={description} />
    <div className="wgsa-card-footer">
      <Link
        className="mdl-button mdl-button--primary wgsa-button--text"
        to={link}
      >
        View Collection
      </Link>
      { pubmedLink && <a className="mdl-button wgsa-button--text" href={pubmedLink} target="_blank" rel="noopener">Pubmed</a>}
    </div>
  </article>
);

function mapStateToProps(state) {
  return {
    collections: getVisibleCollections(state),
    total: getTotalCollections(state),
  };
}

export default connect(mapStateToProps)(
  ({ collections, total }) => (
    <div>
      <div className="wgsa-hipster-style wgsa-filterable-view">
        <Summary>
          <Totals
            visible={collections.length}
            total={total}
            itemType="collections"
          />
        </Summary>
        <Grid
          // className="wgsa-content-margin-right"
          template={CollectionCard}
          items={collections}
          columnWidth={400}
          // columnCount={4}
          rowHeight={200}
        />
      </div>
      <Filter />
    </div>
  )
);
