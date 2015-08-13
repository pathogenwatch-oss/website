var React = require('react');

var NotFound = React.createClass({

  render: function () {

    var h2Style = {
      fontSize: '28px',
      fontWeight: '300'
    };

    return (
      <div className="container text-center">
        <h2 style={h2Style}>
          {this.props.children ? this.props.children : 'Not found.'}
        </h2>
      </div>
    );
  }
});

module.exports = NotFound;
