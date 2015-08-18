var React = require('react');

var logoStyle = {
  padding: '1px 20px'
}

var Logo = React.createClass({

  render: function () {
    return (
      <div style={logoStyle}>
        <img src="../../../assets/img/cGPS.logo.png" width="60px"/>
      </div>
    );
  }
});

module.exports = Logo;

