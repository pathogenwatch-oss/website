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
        name: 'Assembly Id',
        value: isolate.metadata.fileAssemblyId || isolate.metadata.userAssemblyId
      }
    };
  },

  getFormattedResistanceResult: function (resistanceResult) {
    if (resistanceResult === 'RESISTANT') {
      return (<i className="fa fa-square" style={resistantStyle}></i>);
    } else {
      return (<i className="fa fa-square-o"></i>);
    }
  },

  getIsolateMetadataTableCellElements: function () {
    var selectedTableColumnName = TableStore.getColourTableColumnName();
    var dataItemValue;

    var metadataTableCellElements = Object.keys(this.rowData).map(function (dataItemKey) {
      dataItemValue = this.rowData[dataItemKey].value;

      var cellStyle = {
        whiteSpace: 'nowrap'
      };

      if (this.rowData[dataItemKey].name === selectedTableColumnName) {
        cellStyle.backgroundColor = '#e0efff';
      } else {
        cellStyle.backgroundColor = 'inherit';
      }

      return (<td key={this.rowData.assemblyId.value + '_' + dataItemKey} style={cellStyle}>{dataItemValue}</td>);
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

      var cellStyle = {
        whiteSpace: 'nowrap'
      };

      if (dataItemKey === selectedTableColumnName) {
        cellStyle.backgroundColor = '#e0efff';
      } else {
        cellStyle.backgroundColor = 'inherit';
      }

      return (<td key={this.rowData.assemblyId.value + '_' + dataItemKey} className="text-center" style={cellStyle}>{this.getFormattedResistanceResult(dataItemValue)}</td>);
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
