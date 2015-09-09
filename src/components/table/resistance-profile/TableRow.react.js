var React = require('react');
var DataUtils = require('../../../utils/Data');
var MetadataUtils = require('../../../utils/Metadata');
var TableStore = require('../../../stores/TableStore');

var resistantStyle = {
  color: '#ff0000'
};

var TableRow = React.createClass({

  rowData: null,

  componentWillMount: function () {
    var isolate = this.props.isolate;

    this.rowData = {
      assemblyId: {
        name: 'Assembly',
        value: isolate.metadata.assemblyName,
      },
    };
  },

  getFormattedResistanceResult: function (resistanceResult) {
    const isResistant = resistanceResult === 'RESISTANT';
    const icon = isResistant ? 'add' : 'remove';

    return (
      <i className="material-icons" style={ isResistant ? resistantStyle : {}}>{icon}</i>
    );
  },

  getIsolateMetadataTableCellElements: function () {
    var selectedTableColumnName = TableStore.getColourTableColumnName();
    var dataItemValue;

    var metadataTableCellElements = Object.keys(this.rowData).map(function (dataItemKey) {
      dataItemValue = this.rowData[dataItemKey].value;

      var cellStyle = {
        whiteSpace: 'nowrap'
      };

      return (<td key={this.rowData.assemblyId.value + '_' + dataItemKey} className="mdl-data-table__cell--non-numeric" style={cellStyle}>{dataItemValue}</td>);
    }.bind(this));

    return metadataTableCellElements;
  },

  getIsolateResistanceProfileTableCellElements: function () {
    var isolate = this.props.isolate;
    var resistanceProfile = isolate.analysis.resistanceProfile;
    var selectedTableColumnName = TableStore.getColourTableColumnName();
    var dataItemValue;

    var antibioticResistanceTableCellElements = Object.keys(resistanceProfile).sort().map(function (dataItemKey) {
      dataItemValue = resistanceProfile[dataItemKey].resistanceResult;

      const cellStyle = {
        whiteSpace: 'nowrap',
        textAlign: 'center',
      };

      return (<td key={this.rowData.assemblyId.value + '_' + dataItemKey} style={cellStyle}>{this.getFormattedResistanceResult(dataItemValue)}</td>);
    }.bind(this));

    return antibioticResistanceTableCellElements;
  },

  getTableRowElements: function () {
    return this.getIsolateMetadataTableCellElements().concat(this.getIsolateResistanceProfileTableCellElements());
  },

  render: function () {
    return (
      <tr>
        {this.getTableRowElements()}
      </tr>
    );
  }
});

module.exports = TableRow;
