import React from 'react';
import { connect } from 'react-redux';

import Grid from '../../grid';
import GridItem from './GridItem.react';

import { getVisibleFastas } from '../selectors';

export const GridView = React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  render() {
    const { items } = this.props;
    return (
      <Grid
        template={GridItem}
        items={items}
        columnWidth={256}
        rowHeight={160}
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
