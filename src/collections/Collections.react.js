import React from 'react';
import { connect } from 'react-redux';
import { parse } from 'query-string';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import Grid from '../grid';
import Filter from './filter';
import Header from './header';
import CollectionCard from './CollectionCard.react';
import Overlay from '../overlay';
import { DocumentTitle } from '../branding';

import { getCollectionList, getTotal, getStatus } from './selectors';
import { isFilterOpen, isActive } from './filter/selectors';

import { updateFilter } from './filter/actions';

import { statuses } from './constants';

const Collections = React.createClass({

  componentWillMount() {
    this.props.filter();
  },

  componentDidUpdate(previous) {
    if (previous.prefilter !== this.props.prefilter) {
      this.props.filter();
    }
  },

  getEmptyMessage() {
    const { total, match, filterActive } = this.props;
    const { prefilter } = match.params;

    if (prefilter === 'bin' && total === 0) {
      return (
        <p className="wgsa-hub-big-message">
          Nothing in the bin 👍
        </p>
      );
    }

    if (filterActive) {
      return (
        <p className="wgsa-hub-big-message">
          No matches, please refine your search.
        </p>
      );
    }

    return (
      <p className="wgsa-hub-big-message">
        <Link to="/genomes">Create a collection first. 🙂</Link>
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
        className="wgsa-filter-view"
        template={CollectionCard}
        items={collections}
        columnCount={[ { minWidth: 560, count: 2 }, { minWidth: 1020, count: 3 }, { minWidth: 1580, count: 4 } ]}
        rightMargin={16}
        cellArea={400 * 160}
        rowMinHeight={160}
        rowMaxHeight={232}
        rowFooterHeight={36}
      />
    );
  },

  render() {
    const { status } = this.props;
    return (
      <div
        className={classnames(
          'wgsa-collections wgsa-filter-container',
          { 'has-filter': this.props.isFilterOpen }
        )}
      >
        <DocumentTitle title="collections" />
        <Filter />
        <div className="wgsa-filter-content">
          <Header />
          { this.getContent() }
        </div>
        <Overlay visible={status === statuses.LOADING}>
          <p className="wgsa-big-message">
            Loading... ⏳
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
    isFilterOpen: isFilterOpen(state),
    filterActive: isActive(state),
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
