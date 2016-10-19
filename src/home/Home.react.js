import React from 'react';
import { connect } from 'react-redux';

import Grid from '../grid';
import Filter from '../home-filter';
import { Summary, Totals } from '../filter-summary';

import { getVisibleCollections, getTotalCollections } from './selectors';

const CollectionCard = ({ title }) => (
  <article className="wgsa-card wgsa-collection-card">
    <h3 className="wgsa-card-title">{title}</h3>
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
