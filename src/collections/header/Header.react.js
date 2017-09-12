import React from 'react';
import { connect } from 'react-redux';

import { Totals } from '../../filter/summary';
import FilterHeader from '../filter/Header.react';

import { getCollectionList, getTotal } from '../selectors';

const Header = ({ visibleCollections, totalCollections }) => (
  <header>
    <FilterHeader />
    <Totals
      visible={visibleCollections}
      total={totalCollections}
      itemType="collection"
    />
  </header>
);

function mapStateToProps(state) {
  return {
    visibleCollections: getCollectionList(state).length,
    totalCollections: getTotal(state),
  };
}

export default connect(mapStateToProps)(Header);
