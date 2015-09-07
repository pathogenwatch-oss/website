var React = require('react');
var assign = require('object-assign');
import '../../css/upload-review.css'
import InputField from './InputField.react';

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

  render: function () {

    return (
      <InputField type="text" label={this.props.label} value={this.props.value} />
    );
  }
});

module.exports = AssemblyAnalysisItem;
