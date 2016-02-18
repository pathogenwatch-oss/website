import React from 'react';
import VirtualList from 'react-virtual-list';

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

  getListItems() {
    const assemblies = UploadStore.getAssemblies();
    return Object.keys(assemblies).sort((a, b) => {
      if (assemblies[a].hasErrors) {
        return -1;
      } else if (assemblies[b].hasErrors) {
        return 1;
      } else {
        return 0;
      }
    }).map(assemblyName => assemblies[assemblyName]);
  },

  renderItem({ fasta, hasErrors }) {
    const assemblyName = fasta.name;
    return (
      <AssemblyListItem
        key={assemblyName}
        assemblyName={assemblyName}
        isValid={!hasErrors}
        selected={assemblyName === this.state.selectedOption && this.state.isItemSelected}
        isUploading={this.state.isUploading}
      />
    );
  },

  render() {
    const listItems = this.getListItems();
    return (
      <div className="wgsa-assembly-list-wrapper" ref="container">
        <VirtualList
          tagName="ul"
          className="assemblyListContainer"
          items={listItems}
          renderItem={this.renderItem}
          itemHeight={39}
          container={this.refs.container}
          itemBuffer={5}
        />
      </div>
    );
  },

});

module.exports = AssemblyList;
