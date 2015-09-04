import React from 'react';

import AssemblyListItem from '../navigation/AssemblyListItem.react.js';

import UploadWorkspaceNavigationStore from '../../../stores/UploadWorkspaceNavigationStore';
import UploadStore from '../../../stores/UploadStore';
import { validateMetadata } from '../../../utils/Metadata.js';

const AssemblyList = React.createClass({


  getInitialState() {
    return {
      selectedOption: null,
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
      selectedOption: UploadWorkspaceNavigationStore.getFileAssemblyId()
    });
  },

  getListOptionElements: function () {
    const fileAssemblyIds = UploadStore.getFileAssemblyIds();
    const assemblies = UploadStore.getAssemblies();
    const isValidMap = validateMetadata(assemblies);

    return fileAssemblyIds.map((fileAssemblyId) => {
      return (
        <AssemblyListItem key={fileAssemblyId} fileAssemblyId={fileAssemblyId} isValidMap={isValidMap} selected={fileAssemblyId === this.state.selectedOption}/>
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
