var React = require('react');
var LayoutUtils = require('../../utils/Layout');

var LayoutWest = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired
  },

  render: function () {
    var width = this.props.width;
    var height = LayoutUtils.getNorthHeight();

    var style = {
      position: 'absolute',
      width: width + 'px',
      height: height + 'px',
      top: 0,
      left: 0
    };

    return (
      <div style={style} data-mr-layout="west">
        {this.props.children}
      </div>
    );
  }
});

module.exports = LayoutWest;
