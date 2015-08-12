var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var SelectStatus = require('./SelectStatus.react');

var Navigation = React.createClass({
  render: function () {

    var navigationStyle = {
      margin: '35px 0 0 0',
      textTransform: 'uppercase',
      textAlign: 'center',
      overflow: 'hidden'
    };

    var navigationIteamStyle = {
      display: 'inline-block',
      margin: '0 20px',
      fontSize: '16px',
      fontWeight: '400',
      color: '#000000',
      textTransform: 'uppercase',
      lineHeight: '30px',
    };

    return (
      <div className="row">
        <div style={navigationStyle}>
          <div className="col-md-11 col-md-offset-1">
            <div className="row">

              <div className="col-md-3">
                <span style={navigationIteamStyle}>
                  <Link to="upload">Upload</Link>
                </span>
              </div>
              <div className="col-md-3">
                <span style={navigationIteamStyle}>
                  <Link to="instructions">Instructions</Link>
                </span>
              </div>
              <div className="col-md-3">
                <span style={navigationIteamStyle}>
                  <Link to="showcase">Showcase</Link>
                </span>
              </div>
              <div className="col-md-2">
                <span style={navigationIteamStyle}>
                  <Link to="about">About</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Navigation;
