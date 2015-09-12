import React from 'react';

import ReferenceCollectionStore from '../../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../../stores/UploadedCollectionStore';
import FilteredDataStore from '../../../stores/FilteredDataStore';

import TableHeader from './TableHeader.react';
import TableRow from './TableRow.react';

const style = {
  borderTop: 0,
  width: '100%',
};

const DataTable = React.createClass({

  getInitialState: function () {
    return {
      assemblyIds: FilteredDataStore.getAssemblyIds(),
    };
  },

  componentDidMount: function () {
    FilteredDataStore.addChangeListener(this.handleFilteredDataStoreChange);
  },

  componentWillUnmount: function () {
    FilteredDataStore.removeChangeListener(this.handleFilteredDataStoreChange);
  },

  handleFilteredDataStoreChange: function () {
    this.setState({
      assemblyIds: FilteredDataStore.getAssemblyIds(),
    });
  },

  getTableRowElements: function () {
    var tableAssemblyIds = FilteredDataStore.getAssemblyIds();

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
      <table className="mdl-data-table mdl-data-table--selectable" style={style}>
        <TableHeader />
        <tbody>
          { this.getTableRowElements() }
        </tbody>
      </table>
    );
  }
});

module.exports = DataTable;
