var React = require('react');
var LayoutUtils = require('../../utils/Layout');

var LayoutSouth = React.createClass({

  propTypes: {
    top: React.PropTypes.number.isRequired
  },

  render: function () {
    var top = this.props.top;

    var style = {
      position: 'absolute',
      width: '100%',
      // height: this.state.southHeight + 'px',
      top: top,
      bottom: 0,
      overflow: 'scroll',
      backgroundColor: '#ffffff',
      zIndex: 2
    };

    return (
      <div style={style} data-layout="south">
        {this.props.children}
      </div>
    );
  }
});

module.exports = LayoutSouth;
