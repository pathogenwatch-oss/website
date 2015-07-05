var React = require('react');
var DEFAULT = require('../defaults');

var SpeciesTree = require('./SpeciesTree.react');

var SpeciesTreeStore = require('../stores/SpeciesTreeStore');
var SpeciesTreeActionCreators = require('../actions/SpeciesTreeActionCreators');
var SpeciesSubtreeActionCreators = require('../actions/SpeciesSubtreeActionCreators');

var EastContent = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },

  render: function () {
    return (
      <SpeciesTree width={this.props.width} height={this.props.height} />
    );
  }
});

module.exports = EastContent;
