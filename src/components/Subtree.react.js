import React from 'react';

import Tree from './tree/Tree.react';

import SpeciesSubtreeStore from '../stores/SpeciesSubtreeStore';
import SpeciesSubtreeActionCreators from '../actions/SpeciesSubtreeActionCreators';

import { CGPS } from '../defaults';

const nodeLabelStyle = {
  colour: 'rgba(0, 0, 0, 0.87)',
};

const iconStyle = {
  color: CGPS.COLOURS.PURPLE,
};

function styleTree(tree) {
  const branchIds = Object.keys(tree.branches);
  tree.setNodeDisplay(branchIds, { colour: CGPS.COLOURS.PURPLE_LIGHT });
  branchIds.forEach((id) => {
    const branch = tree.branches[id];
    if (branch) {
      branch.labelStyle = nodeLabelStyle;
    }
  });
}

function handleBackButton() {
  SpeciesSubtreeActionCreators.setActiveSpeciesSubtreeId(null);
}

const backButton = (
  <button className="mdl-button mdl-button--icon" onClick={handleBackButton}>
    <i className="material-icons" style={iconStyle}>arrow_back</i>
  </button>
);

export default React.createClass({

  propTypes: {
    tree: React.PropTypes.string,
  },

  render() {
    return (
      <Tree
        title={this.props.tree}
        newick={SpeciesSubtreeStore.getSpeciesSubtree(this.props.tree).newick}
        navButton={backButton}
        styleTree={styleTree} />
    );
  },

});
