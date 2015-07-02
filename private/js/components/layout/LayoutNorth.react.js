var React = require('react');
var LayoutUtils = require('../../utils/Layout');

var LayoutNorth = React.createClass({

  propTypes: {
    height: React.PropTypes.number.isRequired
  },

  render: function () {
    var width = LayoutUtils.getViewportWidth();
    var height = this.props.height;

    var style = {
      position: 'absolute',
      width: width + 'px',
      height: height + 'px',
      top: 0,
      left: 0,
      zIndex: 1
    };

    return (
      <div style={style} data-layout="north">
        {this.props.children}
      </div>
    );
  }
});

module.exports = LayoutNorth;
