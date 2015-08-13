var React = require('react');

var TreeControlButton = React.createClass({
  render: function () {
    var buttonContainerStyle = {
      height: '40px'
    };

    return (
      <div style={buttonContainerStyle}>
        <button type="button" className='btn btn-sm btn-default' onClick={this.props.handleClick}>{this.props.label}</button>
      </div>
    );
  }
});

module.exports = TreeControlButton;
