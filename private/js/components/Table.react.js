var React = require('react');

var PublicCollectionStore = require('../stores/PublicCollectionStore');
var UploadedCollectionStore = require('../stores/UploadedCollectionStore');
var TableStore = require('../stores/TableStore');

var TableHeader = require('./TableHeader.react');
var TableRow = require('./TableRow.react');
// var DataUtils = require('../utils/Data');

var tableStyle = {
  border: 0
};

var DataTable = React.createClass({

  getInitialState: function () {
    return {
      assemblyIds: TableStore.getAssemblyIds()
    };
  },

  // propTypes: {
  //   data: React.PropTypes.object.isRequired,
  //   filteredTableData: React.PropTypes.object.isRequired
  // },

  // shouldComponentUpdate: function (nextProps) {
  //   var currentFilteredTableData = this.props.filteredTableData;
  //   var nextFilteredTableData = nextProps.filteredTableData;
  //
  //   var currentData = this.props.data;
  //   var nextData = nextProps.data;
  //
  //   return (
  //     JSON.stringify(currentFilteredTableData) !== JSON.stringify(nextFilteredTableData)
  //     || JSON.stringify(currentData) !== JSON.stringify(nextData)
  //   );
  // },

  // getColumnNames: function () {
  //   var firstDatumKey = Object.keys(this.props.data)[0];
  //   var datum = this.props.data[firstDatumKey];
  //   var columnNames = Object.keys(datum);
  //   var dataColumnNamesWithoutMetaColumns;
  //
  //   dataColumnNamesWithoutMetaColumns = columnNames.filter(function (dataField) {
  //     return ! DataUtils.isMetaField(dataField);
  //   });
  //
  //   return dataColumnNamesWithoutMetaColumns;
  // },
  //
  // getTableRowElements: function (columnNames) {
  //   var isolates = this.props.filteredTableData;
  //   var dataIds = Object.keys(isolates);
  //   var getTableRowElement = this.getTableRowElement.bind(this, columnNames);
  //
  //   return dataIds.map(getTableRowElement);
  // },
  //
  // getTableRowElement: function (columnNames, dataObjectId) {
  //   var dataObjects = this.props.data;
  //   var dataObject = dataObjects[dataObjectId];
  //
  //   if (!dataObject) {
  //     throw new Error('[Microreact] Uploaded Newick file has id "' + dataObjectId + '" that is not in the uploaded CSV file.');
  //   }
  //
  //   return (<DataTableRow isolate={dataObject} key={dataObjectId} columnNames={columnNames} />);
  // },
  //
  // getTableHeaders: function (columnNames) {
  //   return columnNames.map(function (columnName) {
  //     return columnName.toUpperCase();
  //   });
  // },

  componentDidMount: function () {
    TableStore.addChangeListener(this.handleTableStoreChange);
  },

  handleTableStoreChange: function () {
    this.setState({
      assemblyIds: TableStore.getAssemblyIds()
    });
  },

  getTableRowElements: function () {
    var tableAssemblyIds = TableStore.getAssemblyIds();

    if (! tableAssemblyIds) {
      return null;
    }

    publicCollectionAsseblies = PublicCollectionStore.getPublicCollectionAssemblies();
    uploadedCollectionAsseblies = UploadedCollectionStore.getUploadedCollectionAssemblies();

    var tableRowElements = tableAssemblyIds.map(this.getTableRowElement.bind(null, publicCollectionAsseblies, uploadedCollectionAsseblies));

    return tableRowElements;
  },

  getTableRowElement: function (publicCollectionAssemblies, uploadedCollectionAssemblies, tableAssemblyId) {
    var tableAssembly = publicCollectionAsseblies[tableAssemblyId] || uploadedCollectionAsseblies[tableAssemblyId];
    return (<TableRow isolate={tableAssembly} key={tableAssembly.metadata.assemblyId} />);
  },

  render: function () {
    return (
      <table className="table table-bordered table-striped table-condensed table-hover" style={tableStyle}>
        <TableHeader />
        <tbody>
          { this.getTableRowElements() }
        </tbody>
      </table>
    );
  }
});

module.exports = DataTable;
