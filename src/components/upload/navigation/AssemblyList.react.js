import React from 'react';

import AssemblyListItem from '../navigation/AssemblyListItem.react';

import UploadWorkspaceNavigationStore from '^/stores/UploadWorkspaceNavigationStore';
import UploadStore from '^/stores/UploadStore';

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
  },

  componentWillUnmount() {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  handleUploadWorkspaceNavigationStoreChange() {
    this.setState({
      selectedOption: UploadWorkspaceNavigationStore.getAssemblyName(),
      isItemSelected: (UploadWorkspaceNavigationStore.getCurrentViewPage() === 'assembly'),
    });
  },

  getListOptionElements() {
    const assemblies = UploadStore.getAssemblies();
    return Object.keys(assemblies).map((assemblyName) => {
      const { hasErrors } = assemblies[assemblyName];
      return (
        <AssemblyListItem
          key={assemblyName}
          assemblyName={assemblyName}
          isValid={!hasErrors}
          selected={assemblyName === this.state.selectedOption && this.state.isItemSelected}
          isUploading={this.state.isUploading} />
      );
    });
  },

  render() {
    const listOptionElements = this.getListOptionElements();
    return (
      <ul className="assemblyListContainer">
        {listOptionElements}
      </ul>
    );
  },

});

module.exports = AssemblyList;
