import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import SelectionDropdown from './SelectionDropdown.react';

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

  animating: false,

  onKeyUp(e) {
    if (e.key === 'Escape') this.props.toggle();
  },

  render() {
    const { size, toggle, view } = this.props;
    return (
      <div className="wgsa-selection-summary" onKeyUp={this.onKeyUp}>
        <span className={classnames(
            'mdl-chip mdl-chip--contact wgsa-selection-tabs',
            view && `wgsa-selection-tabs-${view}`
          )}
        >
          <button
            ref={el => { this.sonarEl = el; }}
            className="mdl-chip__contact"
            onClick={() => toggle('selection')}
          >
            {size}
          </button>
          <button className="mdl-chip__text" onClick={() => toggle('collection')}>
            Create Collection
          </button>
          <button className="mdl-chip__text" onClick={() => toggle('download')}>
            Download
          </button>
        </span>
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
