var React = require('react');
var ChangeNodeLabelButton = require('./ChangeNodeLabelButton.react');
var DataUtils = require('../utils/Data.js');

var DEFAULT = require('../defaults');

var FilterNodeLabels = React.createClass({

  DEFAULT_NODE_LABEL: DEFAULT.SELECTED_TREE_NODE_LABEL,

  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      activeButton: null
    };
  },

  componentDidMount: function () {
    var dataObjects = this.props.data;
    var dataFieldsThatFilterNodeLabels = DataUtils.findWhichDataFieldsShouldFilterNodeLabels(dataObjects);
    var firstDataFieldThatFiltersNodeLabels;

    if (dataFieldsThatFilterNodeLabels.length > 0) {
      firstDataFieldThatFiltersNodeLabels = dataFieldsThatFilterNodeLabels[0];
      this.handleChangeNodeLabel(firstDataFieldThatFiltersNodeLabels);
    } else {
      this.handleChangeNodeLabel(this.DEFAULT_NODE_LABEL);
    }
  },

  handleChangeNodeLabel: function (label) {
    this.setState({
      activeButton: label
    });

    this.props.handleChangeNodeLabel(label);
  },

  isActiveButton: function (actualActiveButtonName, expectedActiveButtonName) {
    if (actualActiveButtonName) {
      if (actualActiveButtonName.toLowerCase() === expectedActiveButtonName.toLowerCase()) {
        return true;
      }
    }

    return false;
  },

  getButtonElements: function () {
    var dataObjects = this.props.data;
    var dataFieldsThatFilterNodeLabels = DataUtils.findWhichDataFieldsShouldFilterNodeLabels(dataObjects);
    var activeButton = this.state.activeButton;

    // var defaultMapMarkerColour = (
    //   <ChangeNodeLabelButton
    //     label={this.DEFAULT_NODE_LABEL}
    //     handleClick={this.handleChangeNodeLabel}
    //     changeNodeLabelTo={this.DEFAULT_NODE_LABEL}
    //     isActive={this.isActiveButton(activeButton, this.DEFAULT_NODE_LABEL)}
    //     key={this.DEFAULT_NODE_LABEL} />
    // );

    var buttonElements = [];

    buttonElements = dataFieldsThatFilterNodeLabels.map(function (dataField) {
      return (
        <ChangeNodeLabelButton
          label={dataField}
          handleClick={this.handleChangeNodeLabel}
          changeNodeLabelTo={dataField}
          isActive={this.isActiveButton(activeButton, dataField)}
          key={dataField} />
      );
    }.bind(this));

    //buttonElements.unshift(defaultMapMarkerColour);

    return buttonElements;
  },

  render: function () {

    var buttonElements = this.getButtonElements();

    return (
      <section>

        <div style={this.props.filterGroupStyle}>
          <h4>Labels</h4>
          <p>This will display text next to nodes on tree.</p>

          {buttonElements}
        </div>

      </section>
    );
  }
});

module.exports = FilterNodeLabels;
