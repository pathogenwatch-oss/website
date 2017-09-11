import React from 'react';
import { connect } from 'react-redux';

import SelectionDropdown from './SelectionDropdown.react';
import Overlay from '../../components/overlay';

import { getSelectionSize, isSelectionOpen } from './selectors';

import { toggleDrawer } from './actions';

const Summary = React.createClass({

  componentDidUpdate(previous) {
    if (this.props.size !== previous.size) {
      this.sonarEl.classList.remove('wgsa-sonar-effect');
      void this.sonarEl.offsetWidth;
      this.sonarEl.classList.add('wgsa-sonar-effect');
    }
  },

  render() {
    const { size, isOpen, onClick } = this.props;
    return (
      <div className="wgsa-selection-summary">
        <button className="mdl-chip mdl-chip--contact mdl-chip--active" onClick={onClick}>
          <span ref={el => { this.sonarEl = el; }} className="mdl-chip__contact">{size}</span>
          <span className="mdl-chip__text">
            Create Collection
          </span>
        </button>
        {/* <Overlay isVisible={isOpen} hide={onClick} /> */}
        <SelectionDropdown />
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    size: getSelectionSize(state),
    isOpen: isSelectionOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(toggleDrawer()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
