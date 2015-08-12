var React = require('react');
var LayoutUtils = require('../../utils/Layout');
var DragIcon = require('./DragIcon.react');

var LayoutDivider = React.createClass({

  propTypes: {
    direction: React.PropTypes.string.isRequired,
    isStatic: React.PropTypes.bool,
    top: React.PropTypes.number,
    left: React.PropTypes.number,
    className: React.PropTypes.string
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

    var top = this.props.top || 0;
    var left = this.props.left || 0;
    var width = this.getWidth();
    var height = this.getHeight();
    var cursor = this.getStyleCursor();
    var borderTop = this.getBorderTopOrBottom();
    var borderRight = this.getBorderLeftOrRight();
    var borderBottom = this.getBorderTopOrBottom();
    var borderLeft = this.getBorderLeftOrRight();
    var backgroundColor = this.getBackgroundColor();
    var className = this.props.className || '';

    var style = {
      backgroundColor: backgroundColor,
      cursor: cursor,
      position: 'absolute',
      top: top,
      left: left,
      width: width,
      height: height,
      zIndex: '999',
      borderTop: borderTop,
      borderRight: borderRight,
      borderBottom: borderBottom,
      borderLeft: borderLeft
    };

    var direction = this.props.direction;
    var isStatic = this.props.isStatic || false;

    return (
      <div className={className} style={style}>
        {isStatic ? null : <DragIcon direction={direction} />}
        {this.props.children}
      </div>
    );
  }
});

module.exports = LayoutDivider;
