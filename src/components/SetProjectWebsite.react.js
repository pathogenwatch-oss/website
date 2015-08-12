var React = require('react');

var validator = require('validator');

var SetProjectWebsite = React.createClass({

  getInitialState: function () {
    return {
      inputValue: this.props.value
    };
  },

  componentDidMount: function () {
    React.findDOMNode(this.refs.metadataInput).focus();
  },

  handleChange: function (event) {
    var inputValue = event.target.value;

    this.setState({
      inputValue: inputValue
    });

    if (this.isValid(inputValue)) {
      this.props.handleProjectMetadata('website', inputValue);
    } else {
      this.props.handleProjectMetadata('website', null);
    }
  },

  isValid: function (value) {
    return (validator.isURL(value));
  },

  handleSubmit: function (event) {
    event.preventDefault();

    this.props.handleNavigateToNextMetadata();
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
          <label htmlFor="metadataInput" style={labelStyle}>Your project website: { this.props.isRequired ? <spna style={requireStyle}>*</spna> : null }</label>
          <input type="text" className="form-control input-lg" id="metadataInput" value={this.state.inputValue} onChange={this.handleChange} ref="metadataInput" />
        </div>

        { this.props.isRequired ? <ProjectMetadataIsRequiredMessage /> : null }
      </form>
    );
  }
});

module.exports = SetProjectWebsite;
