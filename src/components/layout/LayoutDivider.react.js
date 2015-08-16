import React from 'react';
import LayoutUtils from '../../utils/Layout';
import DragIcon from './DragIcon.react';

const LayoutDivider = React.createClass({

  propTypes: {
    direction: React.PropTypes.string.isRequired,
    isStatic: React.PropTypes.bool,
    top: React.PropTypes.number,
    left: React.PropTypes.number,
    className: React.PropTypes.string,
  },

  getWidth: function () {
    var direction = this.props.direction;

    if (direction === 'vertical') {
      return LayoutUtils.getDividerSize() + 'px';
    } else if (direction === 'horizontal') {
      return '100%';
    }

    return 'normal';
  },

  getHeight: function () {
    var direction = this.props.direction;

    if (direction === 'vertical') {
      return '100%';
    } else if (direction === 'horizontal') {
      return LayoutUtils.getDividerSize() + 'px';
    }

    return 'normal';
  },

  getStyleCursor: function () {
    var direction = this.props.direction;
    var isStatic = this.props.isStatic;

    if (isStatic) {
      return 'default';
    }

    if (direction === 'vertical') {
      return 'ew-resize';
    } else if (direction === 'horizontal') {
      return 'ns-resize';
    }

    return 'normal';
  },

  getBorderTopOrBottom: function () {
    var direction = this.props.direction;
    var dividerBorderThickness = LayoutUtils.DIVIDER_BORDER_THICKNESS + 'px';

    if (direction === 'vertical') {
      return 0;
    } else if (direction === 'horizontal') {
      return dividerBorderThickness + ' solid ' + this.getBorderColor();
    }

    return 'auto';
  },

  getBorderLeftOrRight: function () {
    var direction = this.props.direction;
    var dividerBorderThickness = LayoutUtils.DIVIDER_BORDER_THICKNESS + 'px';

    if (direction === 'vertical') {
      return dividerBorderThickness + ' solid ' + this.getBorderColor();
    } else if (direction === 'horizontal') {
      return 0;
    }

    return 'auto';
  },

  getBorderColor: function () {
    var isStatic = this.props.isStatic || false;

    if (isStatic) {
      return '#888';
    }

    return '#555';
  },

  getBackgroundColor: function () {
    var isStatic = this.props.isStatic || false;

    if (isStatic) {
      return '#ccc';
    }

    return '#fff';
  },

  render: function () {
    const style = {
      backgroundColor: this.getBackgroundColor(),
      cursor: this.getStyleCursor(),
      position: 'absolute',
      top: this.props.top || 0,
      left: this.props.left || 0,
      width: this.getWidth(),
      height: this.getHeight(),
      zIndex: '999',
      boxShadow: this.props.direction === 'horizontal' ?
        '0 -1px 1.5px 0 rgba(0,0,0,.12), 0 -4px 4px 0 rgba(0,0,0,.06)' :
        // '0 -1px 0 0 rgba(0,0,0,.14), 0 -2px 3px 0 rgba(0,0,0,.12)' :
        '1px 0 1.5px 0 rgba(0,0,0,.12), 4px 0px 4px 0 rgba(0,0,0,.06)',
        // '1px 0px 0 rgba(0,0,0,.14), 2px 0px 3px 0 rgba(0,0,0,.12)',
    };
    const isStatic = this.props.isStatic || false;

    return (
      <div className={this.props.className || ''} style={style}>
        {isStatic ? null : <DragIcon direction={this.props.direction} />}
        {this.props.children}
      </div>
    );
  }
});

module.exports = LayoutDivider;
