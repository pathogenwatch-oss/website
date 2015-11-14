import React from 'react';

import ExplorerMap from './ExplorerMap.react';

const EastContent = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  },

  render: function () {
    return (
      <ExplorerMap dimensions={this.props} />
    );
  },

});

module.exports = EastContent;
