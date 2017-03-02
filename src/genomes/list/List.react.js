import React from 'react';
import { connect } from 'react-redux';

import Grid from '../../grid';
import GenomeCard from '../card';

import { getGridItems } from '../grid/selectors';
import { getPrefilter } from '../filter/selectors';
import { getTotal } from '../summary/selectors';
import { getStatus } from '../selectors';

import { statuses } from '../constants';

export const GridView = React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  componentWillMount() {
    document.title = 'WGSA | Genomes';
  },

  getEmptyMessage() {
    const { total, prefilter } = this.props;

    if (total === 0) {
      switch (prefilter) {
        case 'upload':
          return (
            <p className="wgsa-filterable-content wgsa-hub-big-message">
              Drag and drop files to begin.
            </p>
          );
        case 'bin':
          return (
            <p className="wgsa-filterable-content wgsa-hub-big-message">
              Nothing in the bin 👍
            </p>
          );
        default:
          return (
            <p className="wgsa-filterable-content wgsa-hub-big-message">
              Something went wrong. 😞
            </p>
          );
      }
    }

    return (
      <p className="wgsa-filterable-content wgsa-hub-big-message">
        No matches.
      </p>
    );
  },

  render() {
    const { items, status } = this.props;

    if (status === statuses.LOADING) {
      return (
        <p className="wgsa-filterable-content wgsa-hub-big-message">
          Loading... ⌛
        </p>
      );
    }

    if (status === statuses.ERROR) {
      return (
        <p className="wgsa-filterable-content wgsa-hub-big-message">
          Something went wrong. 😞
        </p>
      );
    }

    return items.length ? (
      <Grid
        className="wgsa-genomes-list-view"
        template={GenomeCard}
        items={items}
        columnCount={1}
        rowHeight={64}
      />
    ) : this.getEmptyMessage();
  },

});

function mapStateToProps(state) {
  return {
    items: getGridItems(state),
    prefilter: getPrefilter(state),
    total: getTotal(state),
    status: getStatus(state),
  };
}

export default connect(mapStateToProps)(GridView);
