import React from 'react';
import { connect } from 'react-redux';

import { getGenomes } from '../../collection-route/selectors';
import { getFilter, getColourGetter } from '../selectors';
import { getMetadataTable } from '../table/selectors';
import { getVisibleTree } from './selectors';

import { nonResistantColour } from '../amr-utils';
import { getLeafStyle } from './utils';
import { defaultLeafStyle } from './constants';

const Styler = React.createClass({

  componentDidUpdate() {
    const { phylocanvas, genomes, filter } = this.props;

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

    phylocanvas.draw();
  },

  render() {
    return null;
  },

});

function mapStateToProps(state) {
  return {
    genomes: getGenomes(state),
    getColour: getColourGetter(state),
    getLabel: getMetadataTable(state).activeColumn.valueGetter,
    filter: getFilter(state),
    treeType: getVisibleTree(state).type,
    loaded: getVisibleTree(state).loaded,
  };
}

export default connect(mapStateToProps)(Styler);
