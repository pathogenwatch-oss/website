import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import SortSelect from './SortSelect.react';
import LogicalOperator from './LogicalOperator.react';

import {
  getSearchItems,
  getItemAtCursor,
  getRecentSearches,
  getSearchTerms,
  getSelectedCategory,
} from './selectors';

import {
  removeSearchTerm,
  selectSearchCategory,
} from './actions';

import { selectSearchItem } from './thunks';

const AdvancedMode = React.createClass({

  displayName: 'AdvancedMode',

  propTypes: {
    open: React.PropTypes.bool,
  },

  renderCurrentFilter() {
    const { current, removeTerm } = this.props;
    if (!current.length) return null;
    return (
      <section>
        <h2 className="wgsa-search-dropdown__heading">Current Filter</h2>
        {current.map((terms, index) =>
          <ul key={index}>
            {terms.map((term, termIndex) =>
              <li key={term.key}>
                <span className="mdl-chip mdl-chip--deletable mdl-chip--contact mdl-chip--alt">
                  <span className="mdl-chip__contact">{term.value.ids.length}</span>
                  <span className="mdl-chip__text">
                    <small>{term.category.label}:&nbsp;</small>
                    <strong>{term.value.label}</strong>
                  </span>
                  <button className="mdl-chip__action" onClick={() => removeTerm(term, index)} title="Remove">
                    <i className="material-icons">cancel</i>
                  </button>
                </span>
                { termIndex < terms.length - 1 && <span className="wgsa-search-operator">AND</span> }
              </li>)}
              <li>
                <LogicalOperator operator="AND" index={index} />
              </li>
              { index < current.length - 1 &&
                <li className="wgsa-search-operator">
                  <span>OR</span>
                </li> }
              { index === current.length - 1 &&
                <li className="wgsa-search-operator">
                  <LogicalOperator operator="OR" index={current.length} />
                </li> }
          </ul>
        )}
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
                className="mdl-chip mdl-chip--contact"
                onClick={() => selectItem(term)}
              >
                <span className="mdl-chip__text">
                  <span className="mdl-chip__contact mdl-chip__contact--muted">{term.value.ids.length}</span>
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

  getColumnHeading(sections) {
    if (sections.length) {
      return (
        <h2 className="wgsa-search-dropdown__heading">
          Choose Column &ndash; Use arrow keys to navigate
        </h2>
      );
    }
    return (
      <span>(No matching column)</span>
    );
  },

  render() {
    const { sections, activeItem, category } = this.props;
    const { selectItem, removeCategory } = this.props;
    return (
      <div className="wgsa-advanced-search">
        { this.renderCurrentFilter() }
        { this.renderRecentTerms() }
        <section>
          { category ?
            <span className="mdl-chip mdl-chip--deletable">
              <span className="mdl-chip__text">{category.label}</span>
              <button className="mdl-chip__action" onClick={() => removeCategory()}>
                <i className="material-icons">cancel</i>
              </button>
            </span> :
            this.getColumnHeading(sections)
          }
        </section>
        <div className="wgsa-search-dropdown__values">
          { sections.map(({ heading, items, placeholder, sort }) =>
            <section key={heading}>
              { sort && <SortSelect /> }
              <h3 className="wgsa-search-dropdown__heading">{heading}</h3>
              {(placeholder && !items.length) && <p>({placeholder})</p>}
              <ul>
                { items.map(item =>
                  <li key={item.key}>
                    <button
                      className={classnames(
                        'mdl-chip',
                        { 'mdl-chip--active': item === activeItem,
                          'mdl-chip--contact': item.ids }
                      )}
                      onClick={() => selectItem(item)}
                    >
                      {item.ids && <span className="mdl-chip__contact">{item.ids.length}</span>}
                      <span className="mdl-chip__text">{item.label}</span>
                    </button>
                  </li>
                )}
              </ul>
            </section>
          )}
        </div>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
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
    removeTerm: (item, intersection) =>
      dispatch(removeSearchTerm(item, intersection)),
    removeCategory: () => dispatch(selectSearchCategory(null)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedMode);
