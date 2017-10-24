import React from 'react';
import { connect } from 'react-redux';

import Grid from '../../grid';
import GenomeCard from '../card';

import { getGridItems } from '../selectors';

export const GridView = React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  componentWillMount() {
    document.title = 'WGSA | Genomes';
  },

  render() {
    const { items } = this.props;

    return (
      <Grid
        template={GenomeCard}
        items={items}
        columnWidth={256}
        rowHeight={160}
      />
    );
  },

});

function mapStateToProps(state) {
  return {
    items: getGridItems(state),
  };
}

export default connect(mapStateToProps)(GridView);
