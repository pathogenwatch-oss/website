import React from 'react';
import { connect } from 'react-redux';
import { parse } from 'query-string';

import Grid from '../grid';
import Filter from './filter';
import { Summary, Totals } from '../filter/summary';
import CollectionCard from './CollectionCard.react';
import Overlay from '../overlay';

import { getCollectionList, getTotal, getStatus } from './selectors';

import { updateFilter } from './filter/actions';

import { statuses } from './constants';

const Collections = React.createClass({

  componentWillMount() {
    document.title = 'WGSA | Collections';
    this.props.filter();
  },

  componentDidUpdate(previous) {
    if (previous.prefilter !== this.props.prefilter) {
      this.props.filter();
    }
  },

  getEmptyMessage() {
    const { total, match } = this.props;
    const { prefilter } = match.params;

    if (prefilter === 'bin' && total === 0) {
      return (
        <p className="wgsa-hub-big-message">
          Nothing in the bin 👍
        </p>
      );
    }

    return (
      <p className="wgsa-hub-big-message">
        No matches.
      </p>
    );
  },

  getContent() {
    const { status, collections } = this.props;

    if (status === statuses.ERROR) {
      return (
        <p className="wgsa-hub-big-message">
          Something went wrong. 😞
        </p>
      );
    }

    if (collections.length === 0 && status === statuses.LOADING) {
      return null;
    }

    if (collections.length === 0) {
      return this.getEmptyMessage();
    }

    return (
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
    );
  },

  render() {
    const { collections, total, status } = this.props;
    return (
      <div>
        <div className="wgsa-hipster-style wgsa-filterable-view">
          <Summary>
            <Totals
              visible={collections.length}
              total={total}
              itemType="collection"
            />
          </Summary>
          { this.getContent() }
        </div>
        <Filter />
        <Overlay visible={status === statuses.LOADING}>
          <p className="wgsa-big-message">
            Loading... ⌛
          </p>
        </Overlay>
      </div>
    );
  },

});

function mapStateToProps(state, { match }) {
  const { prefilter } = match.params;
  return {
    prefilter,
    collections: getCollectionList(state),
    total: getTotal(state),
    status: getStatus(state),
  };
}

function mapDispatchToProps(dispatch, { match, location }) {
  const { prefilter } = match.params;
  const query = parse(location.search);
  return {
    filter: () =>
      dispatch(updateFilter({ prefilter, ...query }, false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collections);
