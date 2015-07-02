var React = require('react');
var NProgress = require('nprogress');

var LoadingProject = React.createClass({

  componentDidMount: function () {
    NProgress.start();
  },

  componentWillUnmount: function () {
    NProgress.done();
  },

  render: function () {

    var headerStyle = {
      fontWeight: '100',
      fontSize: '25px'
    };

    var projectIdStyle = {
      fontWeight: '400',
      textTransform: 'uppercase'
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

module.exports = LoadingProject;
