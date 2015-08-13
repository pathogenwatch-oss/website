var React = require('react');

var PublicCollectionStore = require('../../../stores/PublicCollectionStore');
var UploadedCollectionStore = require('../../../stores/UploadedCollectionStore');
var TableStore = require('../../../stores/TableStore');

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

  componentDidMount: function () {
    TableStore.addChangeListener(this.handleTableStoreChange);
  },

  componentWillUnmount: function () {
    TableStore.removeChangeListener(this.handleTableStoreChange);
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

    const publicCollectionAssemblies = PublicCollectionStore.getPublicCollectionAssemblies();
    const uploadedCollectionAssemblies = UploadedCollectionStore.getUploadedCollectionAssemblies();

    var tableRowElements = tableAssemblyIds.map(this.getTableRowElement.bind(null, publicCollectionAssemblies, uploadedCollectionAssemblies));

    return tableRowElements;
  },

  getTableRowElement: function (publicCollectionAssemblies, uploadedCollectionAssemblies, tableAssemblyId) {
    var tableAssembly = publicCollectionAssemblies[tableAssemblyId] || uploadedCollectionAssemblies[tableAssemblyId];
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
