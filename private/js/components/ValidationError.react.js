var React = require('react');

var ValidationError = React.createClass({
  render: function () {
    var headerStyle = {
      fontWeight: '100',
      fontSize: '25px'
    };

    return (
      <div className="container text-center">
        <h1 style={headerStyle}>
          {this.props.children}
        </h1>
      </div>
    );
  }
});

module.exports = ValidationError;
