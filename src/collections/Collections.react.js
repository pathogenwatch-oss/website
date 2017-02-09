import React from 'react';
import { connect } from 'react-redux';

import Grid from '../grid';
import Filter, { stateKey } from './filter';
import { Summary, Totals } from '../filter-summary';
import CollectionCard from './CollectionCard.react';

import { prefilter } from '../prefilter/actions';
import { getVisibleCollections } from './filter/selectors';
import { getTotalCollections } from './selectors';

import { fetchCollections } from './actions';

const Collections = React.createClass({

  componentDidMount() {
    this.props.fetchCollections();
    this.props.prefilter();
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
        </div>
        <Filter />
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    collections: getVisibleCollections(state),
    total: getTotalCollections(state),
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    fetchCollections: () => dispatch(fetchCollections()),
    prefilter: () => dispatch(prefilter(stateKey, props.prefilter)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collections);
