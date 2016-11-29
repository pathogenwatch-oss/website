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
            className="wgsa-tree-controls"
          >
            <div className="wgsa-tree-sliders wgsa-tree-overlay">
              <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect" htmlFor="group-markers-switch">
                <input
                  type="checkbox"
                  id="group-markers-switch"
                  className="mdl-switch__input"
                  onChange={event => onGroupMarkersChange(event.target.checked)}
                />
                <span className="mdl-switch__label">Group markers</span>
              </label>
            </div>
            <div className="wgsa-tree-sliders wgsa-tree-overlay">
              <div className="wgsa-tree-slider">
                <label>Marker Size
                  <input ref="nodeSlider" type="range"
                    onChange={event => onMarkerSizeChange(event.target.value)}
                    min="1" max="8" step="1" value={markerSize}
                    className="mdl-slider mdl-js-slider" tabIndex="0"
                  />
                </label>
              </div>
            </div>
          </div>
        }
      </div>
    );
  },

});
