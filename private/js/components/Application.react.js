var React = require('react');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var Application = React.createClass({

  render: function () {
    return <RouteHandler/>;
  }

});

module.exports = Application;
