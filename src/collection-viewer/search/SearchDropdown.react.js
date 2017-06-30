import React from 'react';
import { connect } from 'react-redux';
// import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { getSearchCategories, getDropdownVisibility } from './selectors';

import { selectSearchCategory } from './actions';

const SearchDropdown = React.createClass({

  displayName: 'SearchDropdown',

  propTypes: {
    open: React.PropTypes.bool,
  },

  getInitialState() {
    return {
    };
  },

  render() {
    const { isOpen, categories, onCategorySelect } = this.props;
    return (
      <ReactCSSTransitionGroup
        className="wgsa-search-dropdown-container"
        transitionName="wgsa-search-dropdown"
        transitionEnterTimeout={280}
        transitionLeaveTimeout={280}
      >
        { isOpen ?
          <div className="wgsa-search-dropdown">
            <h2 className="wgsa-search-dropdown__heading">Recent Searches</h2>
            {categories.map(({ name, columns }) =>
              <section key={name}>
                <h2 className="wgsa-search-dropdown__heading">{name}</h2>
                <ul>
                  { columns.map(category =>
                    <li key={category.columnKey}>
                      <button className="mdl-chip" onClick={() => onCategorySelect(category)}>
                        <span className="mdl-chip__text">{category.label}</span>
                      </button>
                    </li>
                  )}
              </ul>
              </section>
            )}
          </div> :
          null
        }
      </ReactCSSTransitionGroup>
    );
  },

});

function mapStateToProps(state) {
  return {
    categories: getSearchCategories(state),
    isOpen: getDropdownVisibility(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCategorySelect: category => dispatch(selectSearchCategory(category)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchDropdown);
