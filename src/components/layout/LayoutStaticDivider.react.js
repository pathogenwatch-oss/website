var React = require('react');
var LayoutUtils = require('../../utils/Layout');

var LayoutStaticDivider = React.createClass({

  propTypes: {
    top: React.PropTypes.number,
    left: React.PropTypes.number
  },

  render: function () {

    var top = this.props.top || 0;
    var left = this.props.left || 0;
    var width = this.getWidth();
    var height = this.getHeight();
    var cursor = this.getStyleCursor();
    var dividerBorderThickness = LayoutUtils.DIVIDER_BORDER_THICKNESS;
    var className = this.props.className;

    var style = {
      backgroundColor: '#fff',
      cursor: cursor,
      position: 'absolute',
      top: top,
      left: left,
      width: width,
      height: height,
      zIndex: '999',
      borderLeft: dividerBorderThickness + 'px solid #888',
      borderRight: dividerBorderThickness + 'px solid #888'
    };

    return (
      <div style={style}></div>
    );
  }
});

module.exports = LayoutStaticDivider;
