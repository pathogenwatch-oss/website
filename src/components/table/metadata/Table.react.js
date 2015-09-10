import React from 'react';

import ReferenceCollectionStore from '../../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../../stores/UploadedCollectionStore';
import TableStore from '../../../stores/TableStore';

import TableHeader from './TableHeader.react';
import TableRow from './TableRow.react';

const tableStyle = {
  borderTop: 0,
  width: '100%',
};

const DataTable = React.createClass({

  getInitialState: function () {
    return {
      assemblyIds: TableStore.getAssemblyIds()
    };
  },

  componentDidMount: function () {
    TableStore.addChangeListener(this.handleTableStoreChange);
    // componentHandler.upgradeElement(React.findDOMNode(this.refs.table));
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

    const publicCollectionAssemblies = ReferenceCollectionStore.getAssemblies();
    const uploadedCollectionAssemblies = UploadedCollectionStore.getAssemblies();

    var tableRowElements = tableAssemblyIds.map(this.getTableRowElement.bind(null, publicCollectionAssemblies, uploadedCollectionAssemblies));

    return tableRowElements;
  },

  getTableRowElement: function (publicCollectionAssemblies, uploadedCollectionAssemblies, tableAssemblyId) {
    var tableAssembly = publicCollectionAssemblies[tableAssemblyId] || uploadedCollectionAssemblies[tableAssemblyId];
    return (<TableRow isolate={tableAssembly} key={tableAssembly.metadata.assemblyId} />);
  },

  render: function () {
    return (
      <table ref="table" className="mdl-data-table mdl-data-table--selectable" style={tableStyle}>
        <TableHeader />
        <tbody>
          { this.getTableRowElements() }
        </tbody>
      </table>
    );
  }
});

module.exports = DataTable;
