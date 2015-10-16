import React from 'react';

import ExplorerMap from './map/ExplorerMap.react';

const EastContent = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  },

  render: function () {
    return (
      <ExplorerMap
        width={this.props.width}
        height={this.props.height} />
    );
  },

});

module.exports = EastContent;
