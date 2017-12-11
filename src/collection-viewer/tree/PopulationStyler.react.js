import React from 'react';
import { connect } from 'react-redux';

import { getGenomes } from '../../collection-viewer/selectors';
import { getFilter, getHighlightedIds } from '../selectors';
import { getTrees } from './selectors';

import { leafStyles, defaultLeafStyle } from './constants';
import { CGPS } from '../../app/constants';

const Styler = React.createClass({

  componentDidUpdate() {
    const { phylocanvas, genomes, trees, highlightedIds, filter } = this.props;

    for (const leaf of phylocanvas.leaves) {
      const { id } = leaf;
      const genome = genomes[id];
      const subtree = trees[id];
      const {
        collectionIds = [],
        status = 'PENDING',
        size = 0,
        populationSize = 0,
        progress = 0,
      } = subtree || {};

      // styles
      if (!subtree) {
        leaf.setDisplay({
          ...leafStyles.reference,
          leafStyle: {
            ...defaultLeafStyle,
            fillStyle: CGPS.COLOURS.GREY,
          },
        });
      } else {
        leaf.setDisplay({
          ...leafStyles.subtree,
          leafStyle: {
            ...defaultLeafStyle,
            fillStyle: CGPS.COLOURS.PURPLE_LIGHT,
          },
        });
      }

      // labels
      if (!subtree) {
        leaf.label = genome.name;
      } else if (status === 'PENDING') {
        leaf.label = `${genome.name}: ${progress}%`;
      } else if (status === 'READY') {
        const totalCollection = size - populationSize;
        if (populationSize > 0) {
          leaf.label = `${genome.name} (${totalCollection}) [${populationSize}]`;
        } else if (totalCollection > 0) {
          leaf.label = `${genome.name} (${totalCollection})`;
        } else {
          leaf.label = genome.name;
        }
      }

      // the rest
      let isFiltered = !filter.active;
      let isHighlighted = false;
      for (const uuid of collectionIds) {
        if (!isFiltered) {
          isFiltered = filter.active && filter.ids.has(uuid);
        }
        if (!isHighlighted) {
          isHighlighted = highlightedIds.size && highlightedIds.has(uuid);
        }
        if (isHighlighted && isFiltered) break;
      }
      leaf.radius = isFiltered ? 1 : 0;
      leaf.highlighted = isHighlighted;
      leaf.interactive = !!subtree && status === 'READY';
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
    trees: getTrees(state),
    highlightedIds: getHighlightedIds(state),
    filter: getFilter(state),
  };
}

export default connect(mapStateToProps)(Styler);
