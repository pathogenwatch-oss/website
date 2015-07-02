var React = require('react');

var FinishAddingProjectMetadataButton = React.createClass({
  render: function () {

    return (
      <button className="btn btn-success" onClick={this.props.handleFinish}>Finish</button>
    );
  }
});

module.exports = FinishAddingProjectMetadataButton;
