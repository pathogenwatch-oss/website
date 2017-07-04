import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import SearchTerm from './SearchTerm.react';

import {
  getSearchItems,
  getDropdownVisibility,
  getItemAtCursor,
  getRecentSearches,
  getSearchTerms,
  getSelectedCategory,
} from './selectors';

import {
  changeDropdownVisibility,
  removeSearchTerm,
  selectSearchCategory,
} from './actions';

import { selectSearchItem } from './thunks';

const SearchDropdown = React.createClass({

  displayName: 'SearchDropdown',

  propTypes: {
    open: React.PropTypes.bool,
  },

  renderCurrentFilter() {
    const { current, removeTerm } = this.props;
    if (!current.length) return null;
    return (
      <section>
        <h2 className="wgsa-search-dropdown__heading">Current Filter</h2>
        <ul>
          {current.map(term =>
            <li key={term.key}>
              <SearchTerm
                category={term.category}
                value={term.value}
                action={() => removeTerm(term)}
              />
            </li>
          )}
        </ul>
        <hr />
      </section>
    );
  },

  renderRecentTerms() {
    const { recent, selectItem } = this.props;
    if (!recent.length) return null;
    return (
      <section>
        <h2 className="wgsa-search-dropdown__heading">Recently Used</h2>
        <ul>
          {recent.map(term =>
            <li key={term.key}>
              <button
                className="mdl-chip"
                onClick={() => selectItem(term)}
              >
                <span className="mdl-chip__text">
                  <small>{term.category.label}:&nbsp;</small>
                  <strong>{term.value.label}</strong>
                </span>
              </button>
            </li>
          )}
        </ul>
        <hr />
      </section>
    );
  },

  render() {
    const { isOpen, sections, activeItem, close, category } = this.props;
    const { selectItem, removeCategory } = this.props;
    return (
      <ReactCSSTransitionGroup
        className="wgsa-search-dropdown-container"
        transitionName="wgsa-search-dropdown"
        transitionEnterTimeout={280}
        transitionLeaveTimeout={280}
      >
        { isOpen ?
          <div className="wgsa-search-dropdown">
            <button
              className="wgsa-search-dropdown__close mdl-button mdl-button--icon"
              onClick={close}
              title="Close Dropdown"
            >
              <i className="material-icons">clear</i>
            </button>
            { this.renderCurrentFilter() }
            { this.renderRecentTerms() }
            <section>
              { category ?
                <SearchTerm
                  category={category}
                  action={() => removeCategory()}
                /> :
                <h2 className="wgsa-search-dropdown__heading">Choose Column &ndash; Use arrow keys to navigate</h2>
              }
            </section>
            <div className="wgsa-search-dropdown__values">
              { sections.map(({ heading, items, placeholder }) =>
                <section key={heading}>
                  <h3 className="wgsa-search-dropdown__heading">{heading}</h3>
                  {(placeholder && !items.length) && <p>({placeholder})</p>}
                  <ul>
                    { items.map(item =>
                      <li key={item.key}>
                        <button
                          className={classnames(
                            'mdl-chip', { 'mdl-chip--active': item === activeItem }
                          )}
                          onClick={() => selectItem(item)}
                        >
                          <span className="mdl-chip__text">{item.label}</span>
                        </button>
                      </li>
                    )}
                </ul>
                </section>
              )}
            </div>
          </div> :
          null
        }
      </ReactCSSTransitionGroup>
    );
  },

});

function mapStateToProps(state) {
  return {
    isOpen: getDropdownVisibility(state),
    category: getSelectedCategory(state),
    current: getSearchTerms(state),
    recent: getRecentSearches(state),
    sections: getSearchItems(state),
    activeItem: getItemAtCursor(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectItem: item => dispatch(selectSearchItem(item)),
    removeTerm: item => dispatch(removeSearchTerm(item)),
    removeCategory: () => dispatch(selectSearchCategory(null)),
    close: () => dispatch(changeDropdownVisibility(false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchDropdown);
