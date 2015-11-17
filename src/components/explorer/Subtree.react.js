import React from 'react';
import { connect } from 'react-redux';

import Tree from '../tree/Tree.react';

import { setSubtree } from '^/actions/tree';

import { CGPS } from '^/defaults';

const nodeLabelStyle = {
  colour: 'rgba(0, 0, 0, 0.87)',
};

const BackButton = ({ handleBackButton }) => (
  <button className="wgsa-tree-return mdl-button mdl-button--icon" onClick={handleBackButton}>
    <i className="material-icons">arrow_back</i>
  </button>
);

const Subtree = (props) => (<Tree { ...props } />);

Subtree.displayName = 'Subtree';

function mapStateToProps({ entities, display }) {
  const { collections, subtrees } = entities;
  const { subtree } = display;
  const referenceAssembly = collections.reference.assemblies[subtree];
  return {
    title: referenceAssembly ? referenceAssembly.metadata.assemblyName : subtree,
    newick: subtrees[subtree].newick,
    styleTree({ leaves }) {
      leaves.forEach((leaf) => {
        const assembly = collections.uploaded.assemblies[leaf.id];
        leaf.label = assembly ? assembly.metadata.assemblyName : leaf.id;
        leaf.setDisplay({ colour: CGPS.COLOURS.PURPLE_LIGHT });
        leaf.labelStyle = nodeLabelStyle;
      });
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navButton: (<BackButton handleBackButton={() => dispatch(setSubtree(null))} />),
    onUpdated(event) {
      if (event.property !== 'selected') {
        return;
      }
      // const { nodeIds } = event;
      // FilteredDataActionCreators.setAssemblyIds(nodeIds.length ? nodeIds : SubtreeStore.getActiveSubtreeAssemblyIds());
    },
    onRedrawOriginalTree() {
      // FilteredDataActionCreators.setBaseAssemblyIds(SubtreeStore.getActiveSubtreeAssemblyIds());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Subtree);
