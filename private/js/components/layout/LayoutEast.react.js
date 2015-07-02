var React = require('react');
var LayoutUtils = require('../../utils/Layout');

var LayoutEast = React.createClass({

  propTypes: {
    left: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired
  },

  render: function () {
    var left = this.props.left;
    var width = this.props.width;

    var style = {
      position: 'absolute',
      top: 0,
      left: left + 'px',
      width: width + 'px',
      height: '100%',
      overflow: 'hidden'
    };

    return (
      <div style={style} data-layout="east">
        {this.props.children}
      </div>
    );
  }
});

module.exports = LayoutEast;
