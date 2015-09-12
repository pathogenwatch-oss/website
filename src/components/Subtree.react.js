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
    tree: React.PropTypes.string,
  },

  render() {
    return (
      <Tree
        title={this.props.tree}
        newick={SubtreeStore.getSubtree(this.props.tree).newick}
        navButton={backButton}
        styleTree={styleTree} />
    );
  },

});
