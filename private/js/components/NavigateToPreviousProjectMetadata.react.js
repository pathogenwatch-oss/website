var React = require('react');

var NavigateToPreviousProjectMetadata = React.createClass({
  render: function () {
    return (
      <button className="btn btn-primary" onClick={this.props.handleNavigateToPrevious}>Previous</button>
    );
  }
});

module.exports = NavigateToPreviousProjectMetadata;
