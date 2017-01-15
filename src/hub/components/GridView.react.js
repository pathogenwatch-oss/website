import React from 'react';
import { connect } from 'react-redux';

import Grid from '../../grid';
import GenomeCard from '../../genome-card';

import { getVisibleFastas } from '../../hub-filter/selectors';

export const GridView = React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  render() {
    const { items } = this.props;
    return (
      <Grid
        template={GenomeCard}
        items={items}
        columnWidth={256}
        rowHeight={176}
      />
    );
  },

});

function mapStateToProps(state) {
  return {
    items: getVisibleFastas(state),
  };
}

export default connect(mapStateToProps)(GridView);
