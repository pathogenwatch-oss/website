import React from 'react';

import SpeciesTree from './SpeciesTree.react';

export default React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  },

  render: function () {
    return (
      <SpeciesTree
        width={this.props.width}
        height={this.props.height} />
    );
  },

});
