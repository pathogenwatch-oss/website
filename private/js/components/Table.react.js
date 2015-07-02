var React = require('react');

var DataTableHeader = require('./DataTableHeader.react');
var DataTableRow = require('./DataTableRow.react');
var DataUtils = require('../utils/Data');

var DataTable = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    filteredTableData: React.PropTypes.object.isRequired
  },

  shouldComponentUpdate: function (nextProps) {
    var currentFilteredTableData = this.props.filteredTableData;
    var nextFilteredTableData = nextProps.filteredTableData;

    var currentData = this.props.data;
    var nextData = nextProps.data;

    return (
      JSON.stringify(currentFilteredTableData) !== JSON.stringify(nextFilteredTableData)
      || JSON.stringify(currentData) !== JSON.stringify(nextData)
    );
  },

  getColumnNames: function () {
    var firstDatumKey = Object.keys(this.props.data)[0];
    var datum = this.props.data[firstDatumKey];
    var columnNames = Object.keys(datum);
    var dataColumnNamesWithoutMetaColumns;

    dataColumnNamesWithoutMetaColumns = columnNames.filter(function (dataField) {
      return ! DataUtils.isMetaField(dataField);
    });

    return dataColumnNamesWithoutMetaColumns;
  },

  getTableRowElements: function (columnNames) {
    var isolates = this.props.filteredTableData;
    var dataIds = Object.keys(isolates);
    var getTableRowElement = this.getTableRowElement.bind(this, columnNames);

    return dataIds.map(getTableRowElement);
  },

  getTableRowElement: function (columnNames, dataObjectId) {
    var dataObjects = this.props.data;
    var dataObject = dataObjects[dataObjectId];

    if (!dataObject) {
      throw new Error('[Microreact] Uploaded Newick file has id "' + dataObjectId + '" that is not in the uploaded CSV file.');
    }

    return (<DataTableRow isolate={dataObject} key={dataObjectId} columnNames={columnNames} />);
  },

  getTableHeaders: function (columnNames) {
    return columnNames.map(function (columnName) {
      return columnName.toUpperCase();
    });
  },

  render: function () {
    var tableStyle = {
      border: 0
    };

    var columnNames = this.getColumnNames();

    return (
      <table className="table table-bordered table-striped table-condensed table-hover" style={tableStyle}>
        <DataTableHeader headers={this.getTableHeaders(columnNames)} />
        <tbody>
          {this.getTableRowElements(columnNames)}
        </tbody>
      </table>
    );
  }
});

module.exports = DataTable;
