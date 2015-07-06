var React = require('react');
var DEFAULT = require('../defaults');

var SpeciesTree = require('./SpeciesTree.react');

var WestContent = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },

  render: function () {
    return (
      <SpeciesTree
        width={this.props.width}
        height={this.props.height} />
    );
  }
});

module.exports = WestContent;
