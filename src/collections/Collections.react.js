import React from 'react';
import { connect } from 'react-redux';
import { parse } from 'query-string';

import Grid from '../grid';
import Filter from './filter';
import { Summary, Totals } from '../filter/summary';
import CollectionCard from './CollectionCard.react';

import { getCollectionList, getTotal } from './selectors';

import { updateFilter } from './filter/actions';

const Collections = React.createClass({

  componentWillMount() {
    document.title = 'WGSA | Collections';
  },

  componentDidMount() {
    this.props.filter();
  },

  componentDidUpdate(previous) {
    if (previous.match !== this.props.match) {
      this.props.filter();
    }
  },

  getEmptyMessage() {
    const { total, prefilter } = this.props;

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

  render() {
    const { collections, total } = this.props;
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
          { collections.length ?
            <Grid
              template={CollectionCard}
              items={collections}
              columnCount={[ { minWidth: 560, count: 2 }, { minWidth: 1020, count: 3 }, { minWidth: 1580, count: 4 } ]}
              rightMargin={48}
              cellArea={400 * 160}
              rowMinHeight={160}
              rowMaxHeight={232}
              rowFooterHeight={36}
            /> :
            this.getEmptyMessage() }
        </div>
        <Filter />
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    collections: getCollectionList(state),
    total: getTotal(state),
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
