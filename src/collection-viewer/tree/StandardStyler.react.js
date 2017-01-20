import React from 'react';
import { connect } from 'react-redux';

import { getFilter, getColourGetter } from '../selectors';
import { getActiveDataTable } from '../table/selectors';
import { getVisibleTree } from './selectors';

import { nonResistantColour } from '../../utils/resistanceProfile';
import { getLeafStyle } from './utils';
import { defaultLeafStyle } from './constants';

const Styler = React.createClass({

  componentDidUpdate(previous) {
    const { phylocanvas, assemblies, filter } = this.props;

    for (const leaf of phylocanvas.leaves) {
      const { id } = leaf;
      const assembly = assemblies[id];
      const colour = this.props.getColour(assembly);

      leaf.setDisplay({
        ...getLeafStyle(assembly),
        leafStyle: {
          ...defaultLeafStyle,
          fillStyle: colour,
        },
      });

      leaf.radius = colour === nonResistantColour ? 0 : 1;
      leaf.label = this.props.getLabel(assembly);
      leaf.highlighted = filter.active && filter.ids.has(id);
    }

    if (previous.selectedInternalNode) {
      const node = phylocanvas.originalTree.branches[previous.selectedInternalNode];
      if (node) node.highlighted = false;
    }
    if (this.props.selectedInternalNode && filter.active) {
      const node = phylocanvas.originalTree.branches[this.props.selectedInternalNode];
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
    assemblies: state.entities.assemblies,
    getColour: getColourGetter(state),
    getLabel: getActiveDataTable(state).activeColumn.valueGetter,
    filter: getFilter(state),
    treeType: tree.type,
    loaded: tree.loaded,
    selectedInternalNode: tree.selectedInternalNode,
  };
}

export default connect(mapStateToProps)(Styler);
