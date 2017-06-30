import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import SearchDropdown from './SearchDropdown.react';

import { getFilter } from '../selectors';
import { getSearchText, getDropdownVisibility } from './selectors';

import { changeSearchText, changeDropdownVisibility } from './actions';

const Search = React.createClass({

  displayName: 'Search',

  propTypes: {
    filteredAmount: React.PropTypes.number,
    totalAmount: React.PropTypes.number,
    filterColumnName: React.PropTypes.string,
    handleChange: React.PropTypes.func,
  },

  getPlaceholder() {
    if (this.props.dropdownVisible) {
      return 'FILTER COLUMNS';
    }
    return 'SEARCH';
  },

  handleChange(event) {
    this.props.handleChange(event.target.value);
  },

  handleClick() {
    this.refs.input.focus();
    this.props.openDropdown();
  },

  render() {
    const { totalAmount, filteredAmount, searchText } = this.props;
    return (
      <div className="wgsa-search-box-container">
        <div className={classnames(
            'wgsa-search-box',
            { 'wgsa-search-box--active': focus }
          )}
          onClick={this.handleClick}
        >
          <i className="wgsa-search-box__icon material-icons">search</i>
          <input ref="input"
            className="wgsa-search-box__input"
            placeholder={this.getPlaceholder()}
            onChange={this.handleChange}
            value={searchText}
          />
          <p className="wgsa-search-box__numbers">
            {filteredAmount} of {totalAmount}
          </p>
          <SearchDropdown />
        </div>
      </div>
    );
  },

});

function mapStateToProps(state) {
  const filter = getFilter(state);
  const totalAmount = filter.unfilteredIds.length;
  return {
    totalAmount,
    filteredAmount: filter.active ? filter.ids.size : totalAmount,
    searchText: getSearchText(state),
    dropdownVisible: getDropdownVisibility(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleChange: text => dispatch(changeSearchText(text)),
    openDropdown: () => dispatch(changeDropdownVisibility(true)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
