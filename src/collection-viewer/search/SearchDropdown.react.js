import React from 'react';
import { connect } from 'react-redux';
// import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { getSearchCategories } from './selectors';

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
    const { isOpen, categories } = this.props;
    console.log(categories);
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
                  { columns.map(({ id, label }) =>
                    <li key={id}>
                      <button className="mdl-chip">
                        <span className="mdl-chip__text"><strong>{label}</strong></span>
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
  };
}

export default connect(mapStateToProps)(SearchDropdown);
