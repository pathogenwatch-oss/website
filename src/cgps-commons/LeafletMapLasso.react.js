import React from 'react';
import classnames from 'classnames';
import Leaflet from 'leaflet';
import 'leaflet-lassoselect';

const filterTooltip = 'Activate map region filter';
const activeFilterTooltip = 'Disable map region filter';

const iconStyle = {
  width: '30px',
  height: '30px',
  margin: '-2px 0 0 -4px',
  backgroundImage: 'url(\'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDU2LjcgNTYuNyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTYuNyA1Ni43IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJQb2x5X3Rvb2xfZm91ciI+DQoJPHBvbHlsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAxMDEwMSIgc3Ryb2tlLXdpZHRoPSIxLjQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRzPSIzNC45LDE2LjIgMTMuNCwxMy41IDIxLjUsNDMuMiANCgkJNDIuOSwzNy44IDQ4LjMsMjAuNCAJIi8+DQoJPGVsbGlwc2UgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjMDEwMTAxIiBzdHJva2Utd2lkdGg9IjAuOCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBjeD0iMTMuNCIgY3k9IjEzLjUiIHJ4PSI1LjQiIHJ5PSI1LjQiLz4NCgk8ZWxsaXBzZSBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiMwMTAxMDEiIHN0cm9rZS13aWR0aD0iMC44IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGN4PSIzNC45IiBjeT0iMTYuMiIgcng9IjUuNCIgcnk9IjUuNCIvPg0KCTxlbGxpcHNlIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzAxMDEwMSIgc3Ryb2tlLXdpZHRoPSIwLjgiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgY3g9IjIxLjUiIGN5PSI0My4yIiByeD0iNS40IiByeT0iNS40Ii8+DQoJPGVsbGlwc2UgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjMDEwMTAxIiBzdHJva2Utd2lkdGg9IjAuOCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBjeD0iNDIuOSIgY3k9IjM3LjgiIHJ4PSI1LjQiIHJ5PSI1LjQiLz4NCgk8cmVjdCBmaWxsPSJub25lIiB3aWR0aD0iNTYuNCIgaGVpZ2h0PSI1Ni43Ii8+DQo8L2c+DQo8L3N2Zz4=\')',
  backgroundRepeat: 'no-repeat',
};
export default React.createClass({

  displayName: 'LeafletMapLasso',

  propTypes: {
    className: React.PropTypes.string,
    activeClassName: React.PropTypes.string,
    initialPath: React.PropTypes.array,
    onPathChange: React.PropTypes.func,
  },

  contextTypes: {
    map: React.PropTypes.instanceOf(Leaflet.Map),
  },

  getDefaultProps() {
    return {
      activeClassName: 'is-active',
    };
  },

  getInitialState() {
    return {
      isActive: (this.props.initialPath || null) !== null,
    };
  },

  componentDidMount() {
    this.lasso = L.featureGroup.lassoSelect({
      finishedTooltip: 'Click outside the region to cancel the filter.',
      polyline: {
        color: '#673c90',
      },
      initialPath: this.props.initialPath,
    }).addTo(this.context.map);

    this.lasso.on('pathchange', () => {
      const { onPathChange } = this.props;
      if (onPathChange) onPathChange(this.lasso.getPath());
    });
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.initialPath && !nextProps.initialPath) {
      this.setState({ isActive: false });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    const { initialPath } = this.props;

    if (initialPath === null) {
      this.lasso.reset();
    }

    // clear the lasso filter when lasso flag has changed
    if (prevState.isActive !== this.state.isActive) {
      if (this.state.isActive) {
        this.lasso.enable();
      } else {
        this.lasso.disable();
        this.lasso.reset();
      }
    }
  },

  onLassoToggleButtonClick() {
    // toggle the filter state
    this.setState({ isActive: !this.state.isActive });
  },

  render() {
    const { className, activeClassName } = this.props;
    const { isActive } = this.state;

    return (
      <button
        className={
          classnames(
            'leaflet-map-lasso-button',
            className,
            { [activeClassName]: isActive }
          )
        }
        title={isActive ? activeFilterTooltip : filterTooltip}
        onClick={this.onLassoToggleButtonClick}
      >
        <i className="material-icons mr-lasso-icon" style={iconStyle}></i>
      </button>
    );
  },

});
