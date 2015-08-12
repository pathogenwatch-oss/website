var React = require('react');
var FilterMapMarkers = require('./FilterMapMarkers.react');
var FilterNodeLabels = require('./FilterNodeLabels.react');

var Filters = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    colourDataByDataField: React.PropTypes.string,
    setNodeLabelToDataField: React.PropTypes.string
  },

  shouldComponentUpdate: function (nextProps) {

    var currentData = this.props.data;
    var nextData = nextProps.data;

    return (JSON.stringify(currentData) !== JSON.stringify(nextData));
  },

  render: function () {

    var filterGroupStyle = {
      marginTop: '20px',
      marginBottom: '20px'
    };

    return (
      <div className="container-fluid">
        <div className="col-sm-5">

          <FilterMapMarkers
            data={this.props.data}
            handleColourDataByDataField={this.props.handleColourDataByDataField}
            filterGroupStyle={filterGroupStyle}
            colourDataByDataField={this.props.colourDataByDataField} />

        </div>
        <div className="col-sm-7">

          <FilterNodeLabels
            data={this.props.data}
            handleChangeNodeLabel={this.props.handleChangeNodeLabel}
            filterGroupStyle={filterGroupStyle}
            setNodeLabelToDataField={this.props.setNodeLabelToDataField} />

        </div>
      </div>
    );
  }
});

module.exports = Filters;
