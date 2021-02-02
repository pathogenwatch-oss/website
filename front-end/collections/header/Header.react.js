import React from 'react';
import { connect } from 'react-redux';

import { Totals } from '../../filter/summary';
import FilterHeader from '../filter/Header.react';

import { getCollectionList, getTotal } from '../selectors';
import { getActiveSort } from '../filter/selectors';

import { updateFilter } from '../filter/actions';

const Header = ({ visibleCollections, totalCollections, activeSort = 'createdAt-', onSortChange }) => {
  if (totalCollections === 0) return <header></header>;
  return (
    <header>
      <FilterHeader />
      <Totals
        visible={visibleCollections}
        total={totalCollections}
        itemType="collection"
      />
      <label className="wgsa-select-box">
        Sort by
        <select value={activeSort} onChange={onSortChange}>
          <option value="createdAt-">Created: Most Recent</option>
          <option value="createdAt">Created: Least Recent</option>
          <option value="size">Size: Low to High</option>
          <option value="size-">Size: High to Low</option>
          <option value="title">Title: Ascending</option>
          <option value="title-">Title: Descending</option>
          <option value="publicationYear">Published: Ascending</option>
          <option value="publicationYear-">Published: Descending</option>
        </select>
      </label>
    </header>
  );
};

function mapStateToProps(state) {
  return {
    visibleCollections: getCollectionList(state).length,
    totalCollections: getTotal(state),
    activeSort: getActiveSort(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSortChange: e => dispatch(updateFilter({ sort: e.target.value })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
