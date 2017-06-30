import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import SearchDropdown from './SearchDropdown.react';
import ResetButton from '../filter/ResetButton.react';

import { getFilter } from '../selectors';
import { getSearch } from './selectors';

import {
  changeSearchText,
  changeDropdownVisibility,
  selectSearchCategory,
} from './actions';

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
    if (previous.search.category === null && search.category) {
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

  handleClick() {
    this.refs.input.focus();
    this.props.openDropdown();
  },

  handleKeyboard(e) {
    if (e.keyCode === 37 || e.keyCode === 38) {
      this.props.moveCursor(-1);
    }
    if (e.keyCode === 39 || e.keyCode === 40) {
      this.props.moveCursor(1);
    }
    const { text, category } = this.props.search;
    if (e.keyCode === 8 && category && text.length === 0) {
      this.props.deselectCategory();
    }
    if (e.keyCode === 13) {
      this.props.selectCategoryAtCursor();
    }
  },

  render() {
    const { totalAmount, filteredAmount, search } = this.props;
    const { category, text, visible } = search;
    return (
      <div className="wgsa-search-box-container">
        <div className={classnames(
            'wgsa-search-box',
            { 'wgsa-search-box--active': visible }
          )}
          onClick={this.handleClick}
        >
          <i className="wgsa-search-box__icon material-icons">search</i>
          { category &&
            <span className="mdl-chip">
              <strong className="mdl-chip__text">{category.label}:</strong>
            </span> }
          <input ref="input"
            className="wgsa-search-box__input"
            placeholder={this.getPlaceholder()}
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
    openDropdown: () => dispatch(changeDropdownVisibility(true)),
    deselectCategory: () => dispatch(selectSearchCategory(null)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
