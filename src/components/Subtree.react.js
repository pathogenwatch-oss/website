import React from 'react';

import Tree from './tree/Tree.react';

import UploadedCollectionStore from '../stores/UploadedCollectionStore';
import SubtreeStore from '../stores/SubtreeStore';
import SubtreeActionCreators from '../actions/SubtreeActionCreators';

import FilteredDataUtils from '../utils/FilteredData';
import { CGPS } from '../defaults';

const nodeLabelStyle = {
  colour: 'rgba(0, 0, 0, 0.87)',
};

const iconStyle = {
  color: CGPS.COLOURS.PURPLE,
};

function styleTree(tree) {
  tree.leaves.forEach((leaf) => {
    const assembly = UploadedCollectionStore.getAssemblies()[leaf.id];
    tree.setNodeDisplay([ leaf.id ], { colour: FilteredDataUtils.getColour(assembly) });
    leaf.labelStyle = nodeLabelStyle;
  });
}

function handleBackButton() {
  SubtreeActionCreators.setActiveSubtreeId(null);
}

const backButton = (
  <button className="mdl-button mdl-button--icon" onClick={handleBackButton}>
    <i className="material-icons" style={iconStyle}>arrow_back</i>
  </button>
);

export default React.createClass({

  propTypes: {
    treeName: React.PropTypes.string,
  },

  render() {
    const { treeName } = this.props;
    const subtreeAssemblyIds = SubtreeStore.getActiveSubtreeAssemblyIds();
    if (subtreeAssemblyIds.length === 1) {
      const assembly = UploadedCollectionStore.getAssemblies()[subtreeAssemblyIds[0]];
      return (
        <section className="wgsa-tree">
          <header className="wgsa-tree-header">
            { backButton }
            <h2 className="wgsa-tree-heading">{treeName}</h2>
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
        title={treeName}
        newick={SubtreeStore.getActiveSubtree().newick}
        navButton={backButton}
        styleTree={styleTree} />
    );
  },

});
