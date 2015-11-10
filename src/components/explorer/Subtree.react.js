import React from 'react';

import Tree from '../tree/Tree.react';

import UploadedCollectionStore from '^/stores/UploadedCollectionStore';
import ReferenceCollectionStore from '^/stores/ReferenceCollectionStore';
import SubtreeStore from '^/stores/SubtreeStore';

import SubtreeActionCreators from '^/actions/SubtreeActionCreators';
import FilteredDataActionCreators from '^/actions/FilteredDataActionCreators';

import FilteredDataUtils from '^/utils/FilteredData';

const nodeLabelStyle = {
  colour: 'rgba(0, 0, 0, 0.87)',
};

function styleTree(tree) {
  tree.leaves.forEach((leaf) => {
    const assembly = UploadedCollectionStore.getAssemblies()[leaf.id];
    leaf.setDisplay({ colour: FilteredDataUtils.getColour(assembly) });
    leaf.labelStyle = nodeLabelStyle;
  });
}

function handleBackButton() {
  SubtreeActionCreators.setActiveSubtreeId(null);
}

const backButton = (
  <button className="wgsa-tree-return mdl-button mdl-button--icon" onClick={handleBackButton}>
    <i className="material-icons">arrow_back</i>
  </button>
);

function onUpdated(event) {
  if (event.property !== 'selected') {
    return;
  }
  const { nodeIds } = event;
  FilteredDataActionCreators.setAssemblyIds(nodeIds.length ? nodeIds : SubtreeStore.getActiveSubtreeAssemblyIds());
}

function onRedrawOriginalTree() {
  FilteredDataActionCreators.setBaseAssemblyIds(SubtreeStore.getActiveSubtreeAssemblyIds());
}

export default React.createClass({

  propTypes: {
    treeName: React.PropTypes.string,
  },

  render() {
    const { treeName } = this.props;
    const referenceAssembly = ReferenceCollectionStore.getAssemblies()[treeName];
    const title = referenceAssembly ? referenceAssembly.metadata.assemblyName : treeName;
    let newick;

    const subtreeAssemblyIds = SubtreeStore.getActiveSubtreeAssemblyIds();
    if (subtreeAssemblyIds.length === 1) {
      newick = `(${treeName}:0.5,${subtreeAssemblyIds[0]}:0.5);`;
    } else {
      newick = SubtreeStore.getActiveSubtree().newick;
    }

    return (
      <Tree
        title={title}
        newick={newick}
        navButton={backButton}
        styleTree={styleTree}
        onUpdated={onUpdated}
        onRedrawOriginalTree={onRedrawOriginalTree} />
    );
  },

});
