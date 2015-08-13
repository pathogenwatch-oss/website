var React = require('react');
var LayoutUtils = require('../../utils/Layout');

var LayoutMiddle = React.createClass({

  propTypes: {
    left: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired
  },

  render: function () {
    var left = this.props.left;
    var width = this.props.width;

    var style = {
      position: 'absolute',
      width: width + 'px',
      height: '100%',
      top: 0,
      left: left + 'px',
      overflow: 'hidden'
    };

    return (
      <div style={style} data-mr-layout="middle">
        {this.props.children}
      </div>
    );
  }
});

module.exports = LayoutMiddle;
