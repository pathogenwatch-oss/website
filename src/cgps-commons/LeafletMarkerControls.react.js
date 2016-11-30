import React from 'react';
import classnames from 'classnames';

const buttonStyle = {
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 1,
};
export default React.createClass({

  displayName: 'LeafletMapLasso',

  propTypes: {
    className: React.PropTypes.string,
    activeClassName: React.PropTypes.string,
    markerSize: React.PropTypes.number,
    onMarkerSizeChange: React.PropTypes.func,
    onGroupMarkersChange: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      activeClassName: 'is-active',
    };
  },

  getInitialState() {
    return {
      isActive: false,
    };
  },

  componentDidUpdate() {
    if (this.state.isActive) {
      const { slider, countrySwitch } = this.refs;
      componentHandler.upgradeElements([ slider, countrySwitch ]);
    }
  },

  render() {
    const {
      className,
      activeClassName,
      markerSize,
      onMarkerSizeChange,
      onGroupMarkersChange,
    } = this.props;
    const { isActive } = this.state;

    return (
      <div>
        <button
          key="button"
          className={
            classnames(
              'leaflet-marker-controls-button',
              className,
              { [activeClassName]: isActive }
            )
          }
          style={buttonStyle}
          title={isActive ? 'Hide Map Controls' : 'Show Map Controls'}
          onClick={() => this.setState({ isActive: !isActive })}
        >
          <i className="material-icons">tune</i>
        </button>
        {
          isActive &&
          <div
            className="wgsa-pane-controls"
          >
            <div className="wgsa-pane-controls__row wgsa-pane-overlay">
              <div className="wgsa-pane-slider">
                <label>Marker Size
                  <input ref="slider" type="range"
                    onChange={event => onMarkerSizeChange(event.target.value)}
                    min="1" max="8" step="1" value={markerSize}
                    className="mdl-slider mdl-js-slider" tabIndex="0"
                  />
                </label>
              </div>
              <label
                ref="countrySwitch"
                className="mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect"
                htmlFor="group-markers-switch"
                title="View by Country"
              >
                <input
                  type="checkbox"
                  id="group-markers-switch"
                  className="mdl-icon-toggle__input"
                  onChange={event => onGroupMarkersChange(event.target.checked)}
                />
                <i className="mdl-icon-toggle__label material-icons">flag</i>
              </label>
            </div>
          </div>
        }
      </div>
    );
  },

});
