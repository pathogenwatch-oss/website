import React from 'react';
import { connect } from 'react-redux';

import Fade from '../../components/fade';
import AdvancedMode from './AdvancedMode.react';
import BasicMode from './BasicMode.react';

import { getDropdownVisibility, getSearchMode } from './selectors';

import { changeDropdownVisibility, toggleSearchMode } from './actions';

import { modes } from './constants';

const SearchDropdown = React.createClass({

  displayName: 'SearchDropdown',

  propTypes: {
    open: React.PropTypes.bool,
  },

  renderContent(mode) {
    if (mode === modes.ADVANCED) {
      return <AdvancedMode key={mode} />;
    }
    if (mode === modes.BASIC) {
      return <BasicMode key={mode} />;
    }
    return null;
  },

  render() {
    const { isOpen, close, mode, toggleMode } = this.props;
    return (
      <Fade className="wgsa-search-dropdown-container">
        { isOpen ?
          <div className="wgsa-search-dropdown">
            <div className="wgsa-search-dropdown__controls">
              <button
                className="mdl-button wgsa-button--text"
                onClick={toggleMode}
                title="Toggle Search Mode"
              >
                Use { mode === modes.BASIC ? 'Advanced' : 'Basic' }
              </button>
              <button
                className="wgsa-search-dropdown__close mdl-button mdl-button--icon"
                onClick={close}
                title="Close Dropdown"
              >
                <i className="material-icons">clear</i>
              </button>
            </div>
            <Fade out={false} className="wgsa-search-dropdown__content">
              { this.renderContent(mode) }
            </Fade>
          </div> :
          null }
      </Fade>
    );
  },

});

function mapStateToProps(state) {
  return {
    mode: getSearchMode(state),
    isOpen: getDropdownVisibility(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleMode: () => dispatch(toggleSearchMode()),
    close: () => dispatch(changeDropdownVisibility(false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchDropdown);
