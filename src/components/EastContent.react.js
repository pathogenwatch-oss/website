import React from 'react';

import Map from './Map.react';

const EastContent = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  },

  render: function () {
    return (
      <Map
        width={this.props.width}
        height={this.props.height} />
    );
  },

});

module.exports = EastContent;
