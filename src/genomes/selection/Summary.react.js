import React from 'react';
import { connect } from 'react-redux';

import SelectionDropdown from './SelectionDropdown.react';

import { getSelectionSize, isSelectionOpen } from './selectors';

import { toggleDrawer } from './actions';

const Summary = React.createClass({

  componentDidUpdate(previous) {
    if (this.animating) return;
    if (this.props.size !== previous.size) {
      this.sonarEl.classList.remove('wgsa-sonar-effect');
      void this.sonarEl.offsetWidth;
      this.sonarEl.classList.add('wgsa-sonar-effect');
      this.animating = true;
      setTimeout(() => { this.animating = false; }, 1400);
    }
  },

  animating: false,

  onKeyUp(e) {
    if (e.key === 'Escape') this.props.toggle();
  },

  render() {
    const { size, toggle } = this.props;
    return (
      <div className="wgsa-selection-summary" onKeyUp={this.onKeyUp}>
        <button className="mdl-chip mdl-chip--contact" onClick={toggle}>
          <span className="mdl-chip__text">
            Download
          </span>
          <span className="mdl-chip__text">
            Create Collection
          </span>
          <span ref={el => { this.sonarEl = el; }} className="mdl-chip__contact">
            {size}
          </span>
        </button>
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
    toggle: () => dispatch(toggleDrawer()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
