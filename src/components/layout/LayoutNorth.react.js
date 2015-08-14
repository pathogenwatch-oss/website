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
      top: '56px',
      left: 0,
      zIndex: 1,
      overflow: 'hidden'
    };

    return (
      <div style={style} data-layout="north">
        {this.props.children}
      </div>
    );
  }
});

module.exports = LayoutNorth;
