import React from 'react';
import { connect } from 'react-redux';

import { getGenomes, getFilter, getHighlightedIds } from '../selectors';
import { getActiveDataTable, getColourGetter } from '../table/selectors';
import { getVisibleTree, getSelectedInternalNode } from './selectors';

import { nonResistantColour } from '../amr-utils';
import { getLeafStyle } from './utils';
import { defaultLeafStyle, leafStyles } from './constants';

const Styler = React.createClass({

  componentDidUpdate(previous) {
    const {
      phylocanvas, genomes, filter, selectedInternalNode, highlightedIds,
    } = this.props;

    for (const leaf of phylocanvas.leaves) {
      const { id } = leaf;
      const genome = genomes[id];
      const colour = this.props.getColour(genome);

      const style = getLeafStyle(genome);
      leaf.setDisplay({
        shape: style.shape,
        leafStyle: {
          ...defaultLeafStyle,
          fillStyle: colour,
        },
        labelStyle: genome.__isCollection ?
          leafStyles.collection.labelStyle :
          style.labelStyle,
      });

      if (colour === nonResistantColour) leaf.radius = 0;
      else if (filter.active) leaf.radius = filter.ids.has(id) ? 1 : 0;
      else leaf.radius = 1;

      leaf.label = this.props.getLabel(genome);
      leaf.highlighted = highlightedIds.has(id);
    }

    if (previous.selectedInternalNode) {
      const node = phylocanvas.originalTree.branches[previous.selectedInternalNode];
      if (node) node.highlighted = false;
    }
    if (selectedInternalNode) {
      const node = phylocanvas.originalTree.branches[selectedInternalNode];
      if (node) node.highlighted = true;
    }

    phylocanvas.draw();
  },

  render() {
    return null;
  },

});

function mapStateToProps(state) {
  const tree = getVisibleTree(state);
  return {
    genomes: getGenomes(state),
    getColour: getColourGetter(state),
    getLabel: getActiveDataTable(state).activeColumn.valueGetter,
    filter: getFilter(state),
    highlightedIds: getHighlightedIds(state),
    treeType: tree.type,
    loaded: tree.loaded,
    selectedInternalNode: getSelectedInternalNode(state),
  };
}

export default connect(mapStateToProps)(Styler);
