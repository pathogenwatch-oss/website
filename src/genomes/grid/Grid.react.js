import React from 'react';
import { connect } from 'react-redux';

import Grid from '../../grid';
import GenomeCard from '../card';

import { getVisibleGenomes } from '../filter/selectors';
import { getPrefilter, getTotalGenomes } from '../selectors';

export const GridView = React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  componentWillMount() {
    document.title = 'WGSA | Genomes';
  },

  getEmptyMessage() {
    const { total, prefilter } = this.props;

    if (prefilter === 'upload' && total === 0) {
      return (
        <p className="wgsa-filterable-content wgsa-hub-big-message">
          Drag and drop files to begin.
        </p>
      );
    }

    if (prefilter === 'bin' && total === 0) {
      return (
        <p className="wgsa-filterable-content wgsa-hub-big-message">
          Nothing in the bin 👍
        </p>
      );
    }

    return (
      <p className="wgsa-filterable-content wgsa-hub-big-message">
        No matches.
      </p>
    );
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
    ) : this.getEmptyMessage();
  },

});

function mapStateToProps(state) {
  return {
    items: getVisibleGenomes(state),
    total: getTotalGenomes(state),
    prefilter: getPrefilter(state),
  };
}

export default connect(mapStateToProps)(GridView);
