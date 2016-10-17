import React from 'react';

import Grid from '../grid';

import { referenceCollections } from '../species';

const Template = ({ style, title }) => (
  <article style={style} className="wgsa-collection-card">
    <div className="wgsa-card-content">
      <h3 className="wgsa-card-title">{title}</h3>
    </div>
  </article>
);

export default React.createClass({

  compnentWillMount() {
    document.title = 'WGSA | Home';
  },

  render() {
    return (
      <Grid
        className="wgsa-home"
        template={Template}
        items={referenceCollections}
        columnWidth={256}
        rowHeight={160}
      />
    );
  },

});
