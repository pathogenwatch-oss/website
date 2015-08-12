var React = require('react');

var ProjectMetadataIsRequiredMessage = require('./ProjectMetadataIsRequiredMessage.react');

var SetProjectName = React.createClass({

  MINIMUM_NUMBER_OF_CHARACTERS: 5,

  getInitialState: function () {
    return {
      inputValue: this.props.value || ''
    };
  },

  componentDidMount: function () {
    React.findDOMNode(this.refs.metadataInput).focus();
  },

  handleChange: function (event) {
    var inputValue = event.target.value;
    var numberOfCharacters = inputValue.length;

    this.setState({
      inputValue: inputValue
    });

    if (this.isValid(inputValue)) {
      this.props.handleProjectMetadata('name', inputValue);
    } else {
      this.props.handleProjectMetadata('name', null);
    }
  },

  isValid: function (value) {
    return (value.length >= this.MINIMUM_NUMBER_OF_CHARACTERS);
  },

  handleSubmit: function (event) {
    event.preventDefault();

    if (this.isValid(this.state.inputValue)) {
      this.props.handleNavigateToNextMetadata();
    }
  },

  getHintElement: function () {

    var minimumLengthWarningStyle = {
      padding: '0 2px',
      fontSize: '16px',
      color: '#777777'
    };

    if (this.state.inputValue.length < this.MINIMUM_NUMBER_OF_CHARACTERS) {
      return (
        <div style={minimumLengthWarningStyle}>
          Type at least {this.MINIMUM_NUMBER_OF_CHARACTERS} characters.
        </div>
      );
    } else if (this.props.isRequired) {
      return (
        <ProjectMetadataIsRequiredMessage />
      );
    }

    return null;
  },

  render: function () {

    var formStyle = {
      margin: '20px 0'
    };

    var labelStyle = {
      fontWeight: '600',
      fontSize: '20px',
      lineHeight: '32px'
    };

    var inputStyle = {
      fontSize: '20px'
    };

    var warningMessageBoxStyle = {
      padding: '10px',
      backgroundColor: '#fcf8e3',
      border: '1px solid #f5e79e'
    };

    var warningMessageStyle = {
      fontSize: '16px',
      margin: '5px 0',
      padding: '0 5px'
    };

    var requireStyle = {
      color: '#ff0000'
    };

    return (
      <form style={formStyle} onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="metadataInput" style={labelStyle}>What is the name of your project: { this.props.isRequired ? <spna style={requireStyle}>*</spna> : null }</label>
          <input type="text" className="form-control input-lg" id="metadataInput" value={this.state.inputValue} onChange={this.handleChange} ref="metadataInput" />
        </div>

        {this.getHintElement()}

      </form>
    );
  }
});

module.exports = SetProjectName;
