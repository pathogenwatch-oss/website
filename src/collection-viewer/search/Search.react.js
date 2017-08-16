import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import SearchDropdown from './SearchDropdown.react';
import FilterStatus from '../filter/FilterStatus.react';

import { getSearch, getSearchPlaceholder } from './selectors';

import {
  changeDropdownVisibility,
  selectSearchCategory,
  moveCursor,
  toggleSearchMode,
  toggleSearchExactMatch,
} from './actions';

import { selectItemAtCursor, searchTextChanged } from './thunks';

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
    if (previous.search.category !== search.category ||
        previous.search.terms !== search.terms ||
        previous.search.advanced !== search.advanced) {
      this.refs.input.focus();
    }
  },

  handleChange(event) {
    this.props.handleChange(event.target.value);
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
    const { text, category, visible } = this.props.search;
    if (e.keyCode === 8 && category && text.length === 0) {
      this.props.removeCategory();
    }
    if (e.keyCode === 13) {
      this.props.selectItemAtCursor();
    }
    if (e.keyCode === 27 && visible) {
      this.props.toggleMode();
      this.refs.input.blur();
    }
  },

  render() {
    const { toggleMode, toggleExactMatch, search } = this.props;
    const { text, visible, advanced, exact } = search;
    return (
      <div className="wgsa-search-box-container">
        <div className={classnames(
            'wgsa-search-box',
            { 'wgsa-search-box--active': visible }
          )}
          onClick={this.handleClick}
        >
          <i className="wgsa-search-box__icon material-icons">search</i>
          <button
            className={classnames(
              'mdl-button mdl-button--icon',
              { active: advanced }
            )}
            onClick={toggleMode}
            title="Toggle Advanced Search"
          >
            <i className="material-icons">add_box</i>
          </button>
          <button
            className={classnames(
              'mdl-button mdl-button--icon',
              { active: exact && !advanced }
            )}
            disabled={advanced}
            onClick={toggleExactMatch}
            title="Toggle Exact Match"
          >
            <i className="material-icons">explicit</i>
          </button>
          <input ref="input"
            className="wgsa-search-box__input"
            placeholder={this.props.placeholder}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyboard}
            value={text}
          />
          <FilterStatus />
        </div>
        <SearchDropdown />
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    search: getSearch(state),
    placeholder: getSearchPlaceholder(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleChange: text => dispatch(searchTextChanged(text)),
    openDropdown: visible => dispatch(changeDropdownVisibility(visible)),
    removeCategory: () => dispatch(selectSearchCategory(null)),
    selectItemAtCursor: () => dispatch(selectItemAtCursor()),
    moveCursor: delta => dispatch(moveCursor(delta)),
    toggleMode: () => dispatch(toggleSearchMode()),
    toggleExactMatch: () => dispatch(toggleSearchExactMatch()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
