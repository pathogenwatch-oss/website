import React from 'react';
import VirtualList from 'react-virtual-list';

import AssemblyListItem from '../navigation/AssemblyListItem.react';

import UploadWorkspaceNavigationStore from '^/stores/UploadWorkspaceNavigationStore';
import UploadStore from '^/stores/UploadStore';

const itemHeight = 40;

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

    // cache jQuery container
    this.$container = $(this.refs.container);
  },

  componentWillUnmount() {
    UploadWorkspaceNavigationStore.removeChangeListener(this.handleUploadWorkspaceNavigationStoreChange);
  },

  shouldComponentUpdate(nextProps) {
    const { assemblies, selectedAssemblyName } = this.props;
    return (
      assemblies !== nextProps.assemblies || selectedAssemblyName !== nextProps.selectedAssemblyName
    );
  },

  componentDidUpdate(prevProps) {
    const { selectedAssemblyName } = this.props;
    if (selectedAssemblyName && prevProps.selectedAssemblyName !== selectedAssemblyName) {
      this.scrollToAssemblyLink(this.props.selectedAssemblyName);
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
    }).map((assemblyName, index) => {
      if (assemblyName === this.props.selectedAssemblyName) {
        this.selectedItemIndex = index;
      }
      return {
        ...assemblies[assemblyName],
        selected: assemblyName === this.props.selectedAssemblyName && this.state.isItemSelected,
      };
   });
  },

  renderItem({ fasta, hasErrors, selected }) {
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

  scrollToAssemblyLink(assemblyName, speed = 'fast') {
    // const listItems = this.getListItems();
    // let selectedItemIndex = 0;
    // for (const item of listItems) {
    //   if (item.selected) {
    //     break;
    //   }
    //   selectedItemIndex += 1;
    // }
    const itemOffset = this.selectedItemIndex * itemHeight;
    const scrollTop = this.$container.scrollTop();
    const height = this.$container.height();
    if (itemOffset < scrollTop) {
      this.$container.animate({ scrollTop: itemOffset }, speed);
    } else if (itemOffset > scrollTop + height - itemHeight) {
      this.$container.animate({ scrollTop: itemOffset - height + 2.5 * itemHeight  }, speed);
    }
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
          itemHeight={itemHeight}
          container={this.refs.container}
          itemBuffer={5}
        />
      </div>
    );
  },

});

module.exports = AssemblyList;
