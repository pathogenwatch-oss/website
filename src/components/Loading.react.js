import '../css/progress-bar.css';

import React from 'react';

const Loading = React.createClass({

  componentDidMount: function () {
    componentHandler.upgradeElement(React.findDOMNode(this.refs.loader));
  },

  render: function () {
    const headerStyle = {
      fontWeight: '100',
      fontSize: '25px',
    };

    const loaderStyle = {
      width: '100%',
    };

    return (
      <div className="container text-center">
        <div ref="loader" style={loaderStyle} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
        <h1 style={headerStyle}>
          {this.props.children}
        </h1>
      </div>
    );
  },

});

module.exports = Loading;
