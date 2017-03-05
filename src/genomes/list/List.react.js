import React from 'react';
import { connect } from 'react-redux';

import Grid from '../../grid';
import GenomeCard from '../card';

import { getGridItems } from '../selectors';

export const ListView = React.createClass({

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
        columnCount={1}
        rowHeight={64}
      />
    );
  },

});

function mapStateToProps(state) {
  return {
    items: getGridItems(state),
  };
}

export default connect(mapStateToProps)(ListView);
