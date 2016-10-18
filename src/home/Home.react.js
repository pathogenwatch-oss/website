import React from 'react';

import Grid from '../grid';
import { Summary, Totals } from '../filter-summary';

import { referenceCollections } from '../species';

const CollectionCard = ({ title }) => (
  <article className="wgsa-card wgsa-collection-card">
    <h3 className="wgsa-card-title">{title}</h3>
  </article>
);

export default React.createClass({

  componentWillMount() {
    document.title = 'WGSA | Home';
  },

  render() {
    const total = referenceCollections.length;
    return (
      <div className="wgsa-hipster-style wgsa-filterable-view">
        <Summary>
          <Totals visible={total} total={total} itemType="collections" />
        </Summary>
        <Grid
          // className="wgsa-content-margin-right"
          template={CollectionCard}
          items={referenceCollections}
          columnWidth={400}
          // columnCount={4}
          rowHeight={200}
        />
      </div>
    );
  },

});
