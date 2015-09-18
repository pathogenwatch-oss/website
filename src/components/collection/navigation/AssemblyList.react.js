import React from 'react';

import AssemblyListItem from '../navigation/AssemblyListItem.react';

import UploadWorkspaceNavigationStore from '../../../stores/UploadWorkspaceNavigationStore';
import UploadStore from '../../../stores/UploadStore';
import FileUploadingStore from '../../../stores/FileUploadingStore';
import { validateMetadata } from '../../../utils/Metadata';

const AssemblyList = React.createClass({


  getInitialState() {
    return {
      selectedOption: null,
      isUploading: null,
      isItemSelected: null,
    };
  },

  componentDidMount() {
    UploadWorkspaceNavigationStore.addChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange);
  },

  componentWillUnmount() {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange);
  },

  handleFileUploadingStoreChange() {
    this.setState({
      isUploading: FileUploadingStore.getFileUploadingState(),
    });
  },

  handleUploadWorkspaceNavigationStoreChange() {
    this.setState({
      selectedOption: UploadWorkspaceNavigationStore.getAssemblyName(),
      isItemSelected: (UploadWorkspaceNavigationStore.getCurrentViewPage() === 'assembly')
    });
  },

  getListOptionElements: function () {
    const assemblyNames = UploadStore.getAssemblyNames();
    const assemblies = UploadStore.getAssemblies();
    const isValidMap = validateMetadata(assemblies);
    return assemblyNames.map((assemblyName) => {
      return (
        <AssemblyListItem
          key={assemblyName}
          assemblyName={assemblyName}
          isValidMap={isValidMap}
          selected={assemblyName === this.state.selectedOption && this.state.isItemSelected}
          isUploading={this.state.isUploading} />
      );
    });
  },

  render: function () {
    const listOptionElements = this.getListOptionElements();
    return (
      <div>
        <ul className="assemblyListContainer">
          {listOptionElements}
        </ul>
      </div>
    );
  },

});

module.exports = AssemblyList;
