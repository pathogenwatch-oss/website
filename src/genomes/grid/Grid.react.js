import React from 'react';
import { connect } from 'react-redux';

import Grid from '../../grid';
import GenomeCard from '../card';

import { getVisibleFastas } from '../../genomes/filter/selectors';

export const GridView = React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  componentWillMount() {
    document.title = 'WGSA | Genomes';
  },

  render() {
    const { items } = this.props;
    return items.length ? (
      <Grid
        template={GenomeCard}
        items={items}
        columnWidth={256}
        rowHeight={176}
      />
    ) : (
      <p className="wgsa-filterable-content wgsa-hub-big-message">
        No matches.
      </p>
    );
  },

});

function mapStateToProps(state) {
  return {
    items: getVisibleFastas(state),
  };
}

export default connect(mapStateToProps)(GridView);
