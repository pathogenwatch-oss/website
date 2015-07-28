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
      },
      country: {
        name: 'Country',
        value: MetadataUtils.getCountry(isolate)
      },
      source: {
        name: 'Source',
        value: isolate.metadata.source
      },
      date: {
        name: 'Date',
        value: DataUtils.getFormattedDateString(isolate.metadata.date)
      },
      st: {
        name: 'ST',
        value: isolate.analysis.st
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
    var selectedTableColumnName = TableStore.getLabelTableColumnName();
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

  getTableRowElements: function () {
    return this.getIsolateMetadataTableCellElements();
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
