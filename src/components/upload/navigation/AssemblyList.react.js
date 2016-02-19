import React from 'react';
import VirtualList from 'react-virtual-list';

import AssemblyListItem from '../navigation/AssemblyListItem.react';

import UploadWorkspaceNavigationStore from '^/stores/UploadWorkspaceNavigationStore';
import UploadStore from '^/stores/UploadStore';

const AssemblyList = React.createClass({

  propTypes: {
    assemblies: React.PropTypes.object,
    selectedAssemblyName: React.PropTypes.string,
  },

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

  shouldComponentUpdate(nextProps) {
    const { assemblies, selectedAssemblyName } = this.props;

    console.log(assemblies, nextProps.assemblies, assemblies !== nextProps.assemblies,
      selectedAssemblyName !== nextProps.selectedAssemblyName)

    return (
      assemblies !== nextProps.assemblies || selectedAssemblyName !== nextProps.selectedAssemblyName
    );
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedOption !== this.state.selectedOption) {
    }
  },

  handleUploadWorkspaceNavigationStoreChange() {
    this.setState({
      selectedOption: UploadWorkspaceNavigationStore.getAssemblyName(),
      isItemSelected: (UploadWorkspaceNavigationStore.getCurrentViewPage() === 'assembly'),
    });
  },

  getListItems() {
    const { assemblies } = this.props;
    return Object.keys(assemblies).sort((a, b) => {
      if (assemblies[a].hasErrors) {
        return -1;
      } else if (assemblies[b].hasErrors) {
        return 1;
      } else {
        return 0;
      }
    }).map(assemblyName => { return { ...assemblies[assemblyName], selected: assemblyName === this.state.selectedOption && this.state.isItemSelected}; });
  },

  renderItem({ fasta, hasErrors, selected }) {
    // console.log('render', fasta.name);
    const assemblyName = fasta.name;
    return (
      <AssemblyListItem
        key={assemblyName}
        assemblyName={assemblyName}
        isValid={!hasErrors}
        selected={selected}
        isUploading={this.state.isUploading}
      />
    );
  },

  render() {
    console.log(Date.now(), 'render');
    const listItems = this.getListItems();
    return (
      <div className="wgsa-assembly-list-wrapper" ref="container">
        <VirtualList
          tagName="ul"
          className="assemblyListContainer"
          items={listItems}
          renderItem={this.renderItem}
          itemHeight={40}
          container={this.refs.container}
          itemBuffer={5}
        />
      </div>
    );
  },

});

module.exports = AssemblyList;
