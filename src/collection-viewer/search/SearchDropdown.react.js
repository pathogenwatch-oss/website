import React from 'react';
import { connect } from 'react-redux';

import Fade from '../../components/fade';
import AdvancedMode from './AdvancedMode.react';

import { isAdvancedMode } from './selectors';

const SearchDropdown = React.createClass({

  displayName: 'SearchDropdown',

  propTypes: {
    open: React.PropTypes.bool,
  },

  render() {
    const { isOpen } = this.props;
    return (
      <Fade className="wgsa-search-dropdown-container">
        { isOpen ?
          <div className="wgsa-search-dropdown">
            <AdvancedMode />
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

export default connect(mapStateToProps)(SearchDropdown);
