var React = require('react');
var assign = require('object-assign');

var containerStyle = {
  margin: '25px 25px 0 25px',
  verticalAlign: 'top',
  textAlign: 'left'
};

var labelStyle = {
  fontSize: '11px',
  lineHeight: '14px',
  textTransform: 'uppercase'
};

var numberStyle = {
  fontWeight: '400',
  fontSize: '22px'
};

var Component = React.createClass({

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

module.exports = Component;
