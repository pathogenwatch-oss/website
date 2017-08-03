import React from 'react';
import { connect } from 'react-redux';

// import Grid from '../../grid';
import ListItem from './ListItem.react';
// import Header from './Header.react';

import { InfiniteLoader, List } from 'react-virtualized';

import { getGenomes, getListIndices } from '../selectors';
import { getTotal } from '../summary/selectors';

import { fetchGenomes } from '../actions';

function rowRenderer({ key, index, style }) {
  return (
    <div
      key={key}
      style={style}
    >
      {index}
    </div>
  );
}

export const ListView = React.createClass({

  propTypes: {
    items: React.PropTypes.array,
  },

  componentWillMount() {
    document.title = 'WGSA | Genomes';
  },

  render() {
    const { items, total, fetch, indices } = this.props;

    return (
      <InfiniteLoader
        isRowLoaded={({ index }) => !!indices[index]}
        loadMoreRows={fetch}
        rowCount={total}
      >
        {({ onRowsRendered, registerChild }) => (
          <List
            height={100}
            onRowsRendered={onRowsRendered}
            ref={registerChild}
            rowCount={total}
            rowHeight={33}
            rowRenderer={({ key, index, style }) => <ListItem key={key} style={style} item={items[indices[index]]} />}
            width={300}
          />
        )}
      </InfiniteLoader>
    );
    // return (
    //   <Grid
    //     className="wgsa-genome-list-view"
    //     template={ListItem}
    //     items={items}
    //     columnCount={1}
    //     rowHeight={40}
    //     rightMargin={48}
    //     header={<Header />}
    //     headerHeight={25}
    //   />
    // );
  },

});

function mapStateToProps(state) {
  return {
    items: getGenomes(state),
    indices: getListIndices(state),
    total: getTotal(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: props => dispatch(fetchGenomes(props)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
