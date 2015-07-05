var React = require('react');
var DEFAULT = require('../defaults');

var Map = require('./Map.react');

var SpeciesTreeStore = require('../stores/SpeciesTreeStore');
var SpeciesTreeActionCreators = require('../actions/SpeciesTreeActionCreators');
var SpeciesSubtreeActionCreators = require('../actions/SpeciesSubtreeActionCreators');

var EastContent = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },

  render: function () {

    // var map = {
    //   width: this.state.layoutWestWidth,
    //   height: this.state.layoutNorthHeight,
    //   filteredMapData: this.props.filteredMapData,
    //   handleFilterTableData: this.props.handleFilterTableData,
    //   handleInfoWindowIsolateClick: this.props.handleInfoWindowIsolateClick,
    //   colourDataByDataField: this.props.colourDataByDataField
    // };

    return (
      <Map
        width={this.props.width}
        height={this.props.height} />
    );
  }
});

module.exports = EastContent;
