import React from 'react';
import { connect } from 'react-redux';

import Tree from '../tree/Tree.react';

import { setSubtree } from '^/actions/tree';
import { activateFilter, resetFilter } from '^/actions/filter';

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

function mapStateToProps({ entities, display, filter }) {
  const { assemblies, subtrees } = entities;
  const { subtree } = display;
  const referenceAssembly = assemblies[subtree];
  return {
    title: referenceAssembly ? referenceAssembly.metadata.assemblyName : subtree,
    newick: subtrees[subtree].newick,
    styleTree({ leaves }) {
      leaves.forEach((leaf) => {
        const assembly = assemblies[leaf.id];
        leaf.label = assembly ? assembly.metadata.assemblyName : leaf.id;
        leaf.setDisplay({ colour: CGPS.COLOURS.PURPLE_LIGHT });
        leaf.labelStyle = nodeLabelStyle;
        leaf.highlighted = (filter.active && filter.ids.has(leaf.id));
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
      const { nodeIds } = event;
      if (nodeIds.length) {
        dispatch(activateFilter(new Set(nodeIds)));
      } else {
        dispatch(resetFilter());
      }
    },
    onRedrawOriginalTree() {
      dispatch(resetFilter());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Subtree);
