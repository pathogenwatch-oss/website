import '../../css/upload-review.css';

import React from 'react';

import InputField from './InputField.react';

import DEFAULT from '^/defaults';

const errorStyle = {
  color: DEFAULT.DANGER_COLOUR,
};

const AssemblyAnalysisItem = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
    error: React.PropTypes.bool,
  },

  render() {
    return (
      <InputField
        type="text"
        readonly="true"
        label={this.props.label}
        value={this.props.value}
        style={this.props.error ? errorStyle : null}
      />
    );
  },

});

module.exports = AssemblyAnalysisItem;
