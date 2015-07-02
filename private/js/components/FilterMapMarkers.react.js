var React = require('react');
var ChangeMapMarkerButton = require('./ChangeMapMarkerButton.react');
var DataUtils = require('../utils/Data.js');

var FilterMapMarkers = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    colourDataByDataField: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      activeButton: this.props.colourDataByDataField
    };
  },

  handleFilterMapMarkers: function (dataField) {
    this.setState({
      activeButton: dataField
    });

    this.props.handleColourDataByDataField(dataField);
  },

  getButtonElements: function () {
    var dataObjects = this.props.data;
    var dataFieldsThatFilterMapMarkers = DataUtils.findWhichDataFieldsShouldFilterMapMarkers(dataObjects);

    var defaultMapMarkerColour = (
      <ChangeMapMarkerButton
        label={'None'}
        handleClick={function () {
          this.handleFilterMapMarkers(null);
        }.bind(this)}
        isActive={this.state.activeButton === null}
        key={'None'} />
    );

    var buttonElements = [];

    buttonElements = dataFieldsThatFilterMapMarkers.map(function (dataField) {
      return (

        <ChangeMapMarkerButton
          label={dataField}
          handleClick={function () {
            this.handleFilterMapMarkers(dataField);
          }.bind(this)}
          isActive={this.state.activeButton && (this.state.activeButton.toLowerCase() === dataField.toLowerCase())}
          key={dataField} />
      );
    }.bind(this));

    buttonElements.unshift(defaultMapMarkerColour);

    return buttonElements;
  },

  render: function () {
    var buttonElements = this.getButtonElements();

    return (
      <section>

        <div style={this.props.filterGroupStyle}>
          <h4>Shapes and Colours</h4>
          <p>This will update shapes and colours on map and tree.</p>

          {buttonElements}
        </div>

      </section>
    );
  }
});

module.exports = FilterMapMarkers;
