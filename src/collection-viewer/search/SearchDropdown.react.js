import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
  getSearchItems,
  getDropdownVisibility,
  getItemAtCursor,
} from './selectors';

import { selectSearchItem, changeDropdownVisibility } from './actions';

const SearchDropdown = React.createClass({

  displayName: 'SearchDropdown',

  propTypes: {
    open: React.PropTypes.bool,
  },

  render() {
    const { isOpen, sections, activeItem, onItemSelect, close } = this.props;
    return (
      <ReactCSSTransitionGroup
        className="wgsa-search-dropdown-container"
        transitionName="wgsa-search-dropdown"
        transitionEnterTimeout={280}
        transitionLeaveTimeout={280}
      >
        { isOpen ?
          <div className="wgsa-search-dropdown">
            <button className="wgsa-search-dropdown__close mdl-button mdl-button--icon" onClick={close}>
              <i className="material-icons">clear</i>
            </button>
            <h2 className="wgsa-search-dropdown__heading">Recent Searches</h2>
            {sections.map(({ heading, items, placeholder }) =>
              <section key={heading}>
                <h2 className="wgsa-search-dropdown__heading">{heading}</h2>
                {(placeholder && !items.length) && <p>({placeholder})</p>}
                <ul>
                  { items.map(item =>
                    <li key={item.key}>
                      <button
                        className={classnames(
                          'mdl-chip', { 'mdl-chip--active': item === activeItem }
                        )}
                        onClick={() => onItemSelect(item)}
                      >
                        <span className="mdl-chip__text">{item.label}</span>
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
    isOpen: getDropdownVisibility(state),
    // recent: getRecentSearches(state),
    sections: getSearchItems(state),
    activeItem: getItemAtCursor(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onItemSelect: item => dispatch(selectSearchItem(item)),
    close: () => dispatch(changeDropdownVisibility(false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchDropdown);
