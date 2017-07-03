import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import SearchDropdown from './SearchDropdown.react';
import ResetButton from '../filter/ResetButton.react';
import SearchTerm from './SearchTerm.react';

import { getFilter } from '../selectors';
import { getSearch } from './selectors';

import {
  changeSearchText,
  changeDropdownVisibility,
  removeSearchItem,
  moveCursor,
} from './actions';

import { selectItemAtCursor } from './thunks';

const Search = React.createClass({

  displayName: 'Search',

  propTypes: {
    filteredAmount: React.PropTypes.number,
    totalAmount: React.PropTypes.number,
    filterColumnName: React.PropTypes.string,
    handleChange: React.PropTypes.func,
  },

  componentDidUpdate(previous) {
    const { search } = this.props;
    if (previous.search.category === null && search.category ||
        previous.search.terms !== search.terms) {
      this.refs.input.focus();
    }
  },

  getPlaceholder() {
    const { category, visible } = this.props.search;
    if (category) {
      return `FILTER ${category.label}`;
    }
    if (visible) {
      return 'FILTER COLUMNS';
    }
    return 'SEARCH';
  },

  handleChange(event) {
    this.props.handleChange(event.target.value);
  },

  handleFocus() {
    this.props.openDropdown(true);
  },

  handleClick() {
    this.refs.input.focus();
  },

  handleKeyboard(e) {
    if (e.keyCode === 37 || e.keyCode === 38) {
      this.props.moveCursor(-1);
    }
    if (e.keyCode === 39 || e.keyCode === 40) {
      this.props.moveCursor(1);
    }
    const { text, visible } = this.props.search;
    if (e.keyCode === 8 && text.length === 0) {
      this.props.removeItem();
    }
    if (e.keyCode === 13) {
      this.props.selectItemAtCursor();
    }
    if (e.keyCode === 27 && visible) {
      this.props.openDropdown(false);
      this.refs.input.blur();
    }
  },

  render() {
    const { totalAmount, filteredAmount, search, removeItem } = this.props;
    const { text, visible, terms } = search;
    return (
      <div className="wgsa-search-box-container">
        <div className={classnames(
            'wgsa-search-box',
            { 'wgsa-search-box--active': visible }
          )}
          onClick={this.handleClick}
        >
          <i className="wgsa-search-box__icon material-icons">search</i>
          {/* { Array.from(terms).map(term =>
            <SearchTerm
              key={term.key}
              category={term.category}
              value={term.value}
              action={() => removeItem(term)}
            />
          )} */}
          { search.category &&
            <SearchTerm
              category={search.category}
              action={() => removeItem()}
            />
          }
          <input ref="input"
            className="wgsa-search-box__input"
            placeholder={this.getPlaceholder()}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyboard}
            value={text}
          />
          <p className="wgsa-search-box__numbers">
            {filteredAmount} of {totalAmount}
          </p>
          <ResetButton />
        </div>
        <SearchDropdown />
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
    search: getSearch(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleChange: text => dispatch(changeSearchText(text)),
    openDropdown: visible => dispatch(changeDropdownVisibility(visible)),
    removeItem: item => dispatch(removeSearchItem(item)),
    selectItemAtCursor: () => dispatch(selectItemAtCursor()),
    moveCursor: delta => dispatch(moveCursor(delta)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
