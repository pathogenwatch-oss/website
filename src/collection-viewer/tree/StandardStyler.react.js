import React from 'react';
import { connect } from 'react-redux';

import { getGenomes } from '../../collection-viewer/selectors';
import { getFilter, getColourGetter } from '../selectors';
import { getActiveDataTable } from '../table/selectors';
import { getVisibleTree } from './selectors';

import { nonResistantColour } from '../amr-utils';
import { getLeafStyle } from './utils';
import { defaultLeafStyle } from './constants';

const Styler = React.createClass({

  componentDidUpdate(previous) {
    const { phylocanvas, genomes, filter, selectedInternalNode } = this.props;

    for (const leaf of phylocanvas.leaves) {
      const { id } = leaf;
      const genome = genomes[id];
      const colour = this.props.getColour(genome);

      leaf.setDisplay({
        ...getLeafStyle(genome),
        leafStyle: {
          ...defaultLeafStyle,
          fillStyle: colour,
        },
      });

      leaf.radius = colour === nonResistantColour ? 0 : 1;
      leaf.label = this.props.getLabel(genome);
      leaf.highlighted = filter.active && filter.ids.has(id);
    }

    if (previous.selectedInternalNode) {
      const node = phylocanvas.originalTree.branches[previous.selectedInternalNode];
      if (node) node.highlighted = false;
    }
    if (selectedInternalNode && filter.active) {
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
    treeType: tree.type,
    loaded: tree.loaded,
    selectedInternalNode: tree.selectedInternalNode,
  };
}

export default connect(mapStateToProps)(Styler);
