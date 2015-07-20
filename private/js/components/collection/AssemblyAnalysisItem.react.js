var React = require('react');
var assign = require('object-assign');

var containerStyle = {
  margin: '0 0 25px 0',
  verticalAlign: 'top',
  textAlign: 'left'
};

var labelStyle = {
  fontSize: '15px',
  fontWeight: '300',
  lineHeight: '20px',
  textTransform: 'uppercase',
  color: '#777'
};

var numberStyle = {
  fontWeight: '400',
  fontSize: '24px'
};

var AssemblyAnalysisItem = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.number.isRequired
  },

  prettifyValue: function (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  render: function () {
    var value = this.prettifyValue(this.props.value);

    return (
      <div style={containerStyle}>
        <div style={labelStyle}>{this.props.label}</div>
        <div style={numberStyle}>{value}</div>
      </div>
    );
  }
});

module.exports = AssemblyAnalysisItem;
