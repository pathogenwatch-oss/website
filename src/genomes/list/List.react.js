import React from 'react';
import { connect } from 'react-redux';

// import Grid from '../../grid';
import ListItem from './ListItem.react';
import Header from './Header.react';

import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';

import { getGenomes, getListIndices } from '../selectors';
import { getTotal } from '../summary/selectors';

import { fetchGenomes } from '../actions';

const headerHeight = 25;

export const ListView = React.createClass({

  propTypes: {
    items: React.PropTypes.object.isRequired,
  },

  componentWillMount() {
    document.title = 'WGSA | Genomes';
  },

  render() {
    const { items, total, fetch, indices } = this.props;

    return (
      <div className="wgsa-content-margin-left">
        <Header />
        <InfiniteLoader
          isRowLoaded={({ index }) => !!indices[index]}
          loadMoreRows={fetch}
          rowCount={total}
        >
          {({ onRowsRendered, registerChild }) =>
            <AutoSizer>
              {({ width, height }) => (
                <List
                  height={height - headerHeight}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowCount={total}
                  rowHeight={40}
                  rowRenderer={({ key, index, style }) => {
                    const itemId = indices[index];
                    if (itemId) {
                      return <ListItem key={key} style={style} item={items[itemId]} />;
                    }
                    return (
                      <div key={key} style={{ ...style, width: 'calc(100% - 64px)' }} className="wgsa-genome-list-placeholder">
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
    total: getTotal(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: ({ startIndex }) => dispatch(fetchGenomes({ skip: startIndex })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
