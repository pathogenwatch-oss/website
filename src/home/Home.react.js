import React from 'react';
import { connect } from 'react-redux';

import Grid from '../grid';
import Filter from '../home-filter';
import { Summary, Totals } from '../filter-summary';
import CollectionCard from './CollectionCard.react';

import { getVisibleCollections, getTotalCollections } from './selectors';

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
          template={CollectionCard}
          items={collections}
          columnCount={[ { minWidth: 560, count: 2 }, { minWidth: 1020, count: 3 }, { minWidth: 1580, count: 4 } ]}
          rightMargin={48}
          cellArea={400 * 160}
          rowMinHeight={160}
          rowMaxHeight={232}
          rowFooterHeight={36}
        />
      </div>
      <Filter />
    </div>
  )
);
