import React from 'react';
import { connect } from 'react-redux';

import Fade from '../../components/fade';
import Overlay from '../../components/overlay';
import AdvancedMode from './AdvancedMode.react';

import { isAdvancedMode } from './selectors';

import { toggleSearchMode } from './actions';

const SearchDropdown = createClass({

  displayName: 'SearchDropdown',

  propTypes: {
    isOpen: PropTypes.bool,
    close: PropTypes.func,
  },

  render() {
    const { isOpen, close } = this.props;
    return (
      <Fade className="wgsa-search-dropdown-container">
        { isOpen ?
          <div className="wgsa-search-dropdown">
            <button onClick={close} className="mdl-button">
              Close
            </button>
            <AdvancedMode />
            <Overlay hide={close} isVisible />
          </div> :
          null }
      </Fade>
    );
  },

});

function mapStateToProps(state) {
  return {
    isOpen: isAdvancedMode(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    close: () => dispatch(toggleSearchMode()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchDropdown);
