var React = require('react');

var ProjectMetadataIsRequiredMessage = React.createClass({
  render: function () {
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

    return (
      <div style={warningMessageBoxStyle}>
        <div style={warningMessageStyle}>Think carefully, you <strong>will not</strong> be able to change it later.</div>
      </div>
    );
  }
});

module.exports = ProjectMetadataIsRequiredMessage;
