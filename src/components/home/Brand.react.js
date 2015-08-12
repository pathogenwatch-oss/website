var React = require('react');

var Brand = React.createClass({
  render: function () {

    var h1Style = {
      color: '#e74c3c',
      fontSize: '24px',
      fontWeight: '600',
      textTransform: 'uppercase',
      textAlign: 'center'
    };

    var imageStyle = {
      width: '60px'
    };

    return (
      <div>
        <div className="row">
          <div className="col-lg-12 text-center">
            <a href="http://microreact.org">
              <img src="/images/microreact_logo.png" style={imageStyle} />
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <h1 style={h1Style}>
              <a href="http://microreact.org">
              Microreact
              </a>
            </h1>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Brand;
