import React from 'react';
import { connect } from 'react-redux';

import { getFilter, getColourGetter } from '../selectors';
import { getVisibleTree } from './selectors';

import { getLeafStyle } from './utils';
import { defaultLeafStyle } from './constants';

const Styler = React.createClass({

  componentDidUpdate() {
    const { phylocanvas, assemblies, filter } = this.props;

    for (const leaf of phylocanvas.leaves) {
      const { id } = leaf;
      const assembly = assemblies[id];

      leaf.setDisplay({
        ...getLeafStyle(assembly),
        leafStyle: {
          ...defaultLeafStyle,
          fillStyle: this.props.getColour(assembly),
        },
      });
      leaf.label = this.props.getLabel(assembly);
      leaf.highlighted = filter.active && filter.ids.has(id);
    }

    phylocanvas.draw();
  },

  render() {
    return null;
  },

});

function mapStateToProps(state) {
  return {
    assemblies: state.entities.assemblies,
    getColour: getColourGetter(state),
    getLabel: state.tables.metadata.activeColumn.valueGetter,
    filter: getFilter(state),
    treeType: getVisibleTree(state).type,
    loaded: getVisibleTree(state).loaded,
  };
}

export default connect(mapStateToProps)(Styler);
