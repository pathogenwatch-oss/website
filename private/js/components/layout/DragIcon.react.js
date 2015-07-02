var React = require('react');
var LayoutUtils = require('../../utils/Layout');

var DragIcon = React.createClass({
  render: function () {

    var direction = this.props.direction;
    var color = '#aaa';
    var fontSize = '20px';

    var dragIconWidth = 22;
    var horizontalLeft = (LayoutUtils.getViewportWidth() / 2) - (dragIconWidth / 2);

    var horizontalStyle = {
      position: 'absolute',
      top: '3px',
      left: horizontalLeft,
      fontSize: fontSize,
      color: color
    };

    var dragIconHeight = 24;
    var verticalTop = (LayoutUtils.getNorthHeight() / 2) - (dragIconHeight / 2);

    var verticalStyle = {
      position: 'absolute',
      top: verticalTop,
      left: '3px',
      fontSize: fontSize,
      color: color
    };

    if (direction === 'horizontal') {
      return (
        <span className="glyphicon glyphicon-option-horizontal" aria-hidden="true" style={horizontalStyle}></span>
      );
    } else if (direction === 'vertical') {
      return (
        <span className="glyphicon glyphicon-option-vertical" aria-hidden="true" style={verticalStyle}></span>
      );
    }
  }
});

module.exports = DragIcon;
