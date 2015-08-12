var React = require('react');

var NavigateToNextProjectMetadata = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    handleNavigateToNext: React.PropTypes.func.isRequired
  },

  render: function () {
    var buttonStyle = {
      marginLeft: '10px'
    };

    return (
      <button style={buttonStyle} className="btn btn-primary" onClick={this.props.handleNavigateToNext}>{this.props.label}</button>
    );
  }
});

module.exports = NavigateToNextProjectMetadata;
