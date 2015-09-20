import React from 'react';

import Tree from './tree/Tree.react';

import UploadedCollectionStore from '../stores/UploadedCollectionStore';
import ReferenceCollectionStore from '../stores/ReferenceCollectionStore';
import SubtreeStore from '../stores/SubtreeStore';
import SubtreeActionCreators from '../actions/SubtreeActionCreators';

import FilteredDataUtils from '../utils/FilteredData';

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

export default React.createClass({

  propTypes: {
    treeName: React.PropTypes.string,
  },

  render() {
    const referenceAssembly = ReferenceCollectionStore.getAssemblies()[this.props.treeName];
    const title = referenceAssembly.metadata.assemblyName;

    const subtreeAssemblyIds = SubtreeStore.getActiveSubtreeAssemblyIds();
    if (subtreeAssemblyIds.length === 1) {
      const assembly = UploadedCollectionStore.getAssemblies()[subtreeAssemblyIds[0]];
      return (
        <section className="wgsa-tree">
          <header className="wgsa-tree-header">
            { backButton }
            <h2 className="wgsa-tree-heading">{title}</h2>
          </header>
          <div className="wgsa-no-subtree">
            <i className="material-icons">nature</i>
            <h3>{assembly.metadata.assemblyName}</h3>
            <p><em>n differences</em></p>
          </div>
        </section>
      );
    }

    return (
      <Tree
        title={title}
        newick={SubtreeStore.getActiveSubtree().newick}
        navButton={backButton}
        styleTree={styleTree} />
    );
  },

});
