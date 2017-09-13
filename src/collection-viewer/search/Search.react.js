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
  moveIntersection,
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
        previous.search.intersections !== search.intersections ||
        previous.search.currentIntersection !== search.currentIntersection ||
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
    const { text, category } = this.props.search;
    switch (e.keyCode) {
      case 37:
        this.props.moveCursor(-1); break;
      case 39:
        this.props.moveCursor(1); break;
      case 38:
        this.props.moveIntersection(-1); break;
      case 40:
        this.props.moveIntersection(1); break;
      case 8: {
        if (category && text.length === 0) {
          this.props.removeCategory();
        }
        break;
      }
      case 13:
        this.props.selectItemAtCursor(); break;
      default:
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
              { active: exact }
            )}
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
    moveIntersection: delta => dispatch(moveIntersection(delta)),
    toggleMode: () => dispatch(toggleSearchMode()),
    toggleExactMatch: () => dispatch(toggleSearchExactMatch()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
