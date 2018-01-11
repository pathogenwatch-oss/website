import React from 'react';
import { connect } from 'react-redux';

import SelectionDropdown from './dropdown';

import { getSelectionSize, getSelectionDropdownView } from './selectors';

import { toggleDropdown } from './actions';

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

  onKeyUp(e) {
    if (e.key === 'Escape') this.props.toggle();
  },

  animating: false,

  render() {
    const { size, toggle, view } = this.props;
    return (
      <div className="wgsa-selection-summary" onKeyUp={this.onKeyUp}>
        <button
          className="mdl-chip mdl-chip--contact mdl-chip--active wgsa-selection"
          onClick={() => toggle(view || 'selection')}
          title={size === 0 ? 'No Genomes Selected' : undefined}
        >
          <span
            ref={el => { this.sonarEl = el; }}
            className="mdl-chip__contact"
            title={size > 0 ? 'View Selection' : undefined}
          >
            {size}
          </span>
          <span className="mdl-chip__text">Selected Genomes</span>
        </button>
        <SelectionDropdown />
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    size: getSelectionSize(state),
    view: getSelectionDropdownView(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggle: (view) => dispatch(toggleDropdown(view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
