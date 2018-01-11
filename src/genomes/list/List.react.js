import React from 'react';
import { connect } from 'react-redux';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';

import ListItem from './ListItem.react';
import Header from './Header.react';

import { getGenomes, getListIndices } from '../selectors';
import { getVisible } from '../summary/selectors';

import { fetchGenomeList } from '../actions';

const headerHeight = 25;
const rowHeight = 40;
const offset = 64 + 56 + headerHeight;

export const ListView = React.createClass({

  propTypes: {
    items: React.PropTypes.object.isRequired,
    indices: React.PropTypes.object.isRequired,
    total: React.PropTypes.number.isRequired,
  },

  componentWillMount() {
    document.title = 'WGSA | Genomes';
  },

  hasScrollbar() {
    const { total } = this.props;
    return (
      total * rowHeight >= window.innerHeight - offset
    );
  },

  render() {
    const { items, total, fetch, indices } = this.props;
    return (
      <div className="wgsa-genome-list-view">
        <Header hasScrollbar={this.hasScrollbar()} />
        <InfiniteLoader
          isRowLoaded={({ index }) => indices[index]}
          loadMoreRows={fetch}
          rowCount={total}
          minimumBatchSize={100}
        >
          {({ onRowsRendered, registerChild }) =>
            <AutoSizer>
              {({ width, height }) => (
                <List
                  height={height - headerHeight}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowCount={total}
                  rowHeight={rowHeight}
                  rowRenderer={({ key, index, style }) => {
                    const itemId = indices[index];
                    const styleWithMargin = { ...style, width: 'calc(100% - 32px' };
                    if (typeof itemId === 'string') {
                      return <ListItem key={key} style={styleWithMargin} genome={items[itemId]} index={index} />;
                    }
                    return (
                      <div key={key} style={styleWithMargin} className="wgsa-genome-list-placeholder">
                        <span
                          style={{ width: Math.floor(Math.random() * 200) }}
                        />
                      </div>
                    );
                  }}
                  width={width}
                />
              )}
            </AutoSizer>
          }
        </InfiniteLoader>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    items: getGenomes(state),
    indices: getListIndices(state),
    total: getVisible(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: ({ startIndex, stopIndex }) => dispatch(fetchGenomeList(startIndex, stopIndex)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
