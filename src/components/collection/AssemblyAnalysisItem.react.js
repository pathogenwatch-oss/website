import '../../css/upload-review.css';

import React from 'react';

import InputField from './InputField.react';

const AssemblyAnalysisItem = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.number.isRequired,
  },

  render: function () {
    return (
      <InputField type="text" readonly="true" label={this.props.label} value={this.props.value} />
    );
  },

});

module.exports = AssemblyAnalysisItem;
