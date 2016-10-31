import React from 'react';

import ExplorerMap from './ExplorerMap.react';

export default React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  },

  render() {
    return (
      <ExplorerMap dimensions={this.props} />
    );
  },

});
