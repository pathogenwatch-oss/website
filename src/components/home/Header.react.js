var React = require('react');
var Brand = require('./Brand.react');
var Navigation = require('./Navigation.react');

var Header = React.createClass({
  render: function () {

    var containerStyle = {
      fontFamily: '"Lato", sans-serif',
      margin: '60px 0 60px 0',
      overflow: 'hidden'
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div style={containerStyle}>

            <div className="col-md-2 col-md-offset-1">
              <Brand />
            </div>

            <div className="col-md-8">
              <Navigation />
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = Header;
