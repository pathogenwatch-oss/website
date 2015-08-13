import React from 'react';
import NProgress from 'nprogress';

const Loading = React.createClass({

  componentDidMount: function () {
    NProgress.start();
  },

  componentWillUnmount: function () {
    NProgress.done();
  },

  render: function () {
    const headerStyle = {
      fontWeight: '100',
      fontSize: '25px',
    };

    return (
      <div className="container text-center">
        <h1 style={headerStyle}>
          {this.props.children}
        </h1>
      </div>
    );
  },

});

module.exports = Loading;
