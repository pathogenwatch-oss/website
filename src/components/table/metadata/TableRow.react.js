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
        value: isolate.metadata.assemblyFilename,
      },
      country: {
        name: 'Country',
        value: MetadataUtils.getCountry(isolate)
      },
      source: {
        name: 'Source',
        value: isolate.metadata.source,
        numeric: true,
      },
      date: {
        name: 'Date',
        value: DataUtils.getFormattedDateString(isolate.metadata.date),
      },
      st: {
        name: 'ST',
        value: isolate.analysis.st,
        numeric: true,
      },
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
    const selectedTableColumnName = TableStore.getLabelTableColumnName();

    const metadataTableCellElements = Object.keys(this.rowData).map((dataItemKey) => {
      const dataItem = this.rowData[dataItemKey];

      const cellStyle = {
        whiteSpace: 'nowrap',
      };

      return (<td key={this.rowData.assemblyId.value + '_' + dataItemKey} style={cellStyle} className={dataItem.numeric ? '' : 'mdl-data-table__cell--non-numeric'}>{dataItem.value}</td>);
    });

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
