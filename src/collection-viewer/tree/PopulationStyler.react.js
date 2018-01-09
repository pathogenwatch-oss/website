import React from 'react';
import { connect } from 'react-redux';

import { getGenomes, getFilter, getHighlightedIds } from '../selectors';
import { getTrees } from './selectors';

import { leafStyles, defaultLeafStyle } from './constants';
import { CGPS } from '../../app/constants';

function includesFp(records, idSet, fp) {
  for (const id of idSet) {
    const genome = records[id];
    const { core } = genome.analysis;
    if (core.fp.reference === fp) return true;
  }
  return false;
}

const Styler = React.createClass({

  componentDidUpdate() {
    const { phylocanvas, genomes, trees, highlightedIds, filter } = this.props;

    for (const leaf of phylocanvas.leaves) {
      const { id } = leaf;
      const reference = genomes[id];
      const subtree = trees[id] || {};
      const {
        status = 'PENDING',
        size = 0,
        populationSize = 0,
        progress = 0,
      } = subtree;

      // styles
      if (size === 0) {
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
      if (size === 0) {
        leaf.label = reference.name;
      } else if (status === 'IN PROGRESS') {
        leaf.label = `${reference.name}: ${progress}%`;
      } else if (status === 'ERROR') {
        leaf.label = `${reference.name}: error, awaiting retry.`;
      } else if (status === 'FAILED') {
        leaf.label = `${reference.name}: failed.`;
      } else if (status === 'READY') {
        const totalCollection = size - populationSize;
        if (populationSize > 0) {
          leaf.label = `${reference.name} (${totalCollection}) [${populationSize}]`;
        } else if (totalCollection > 0) {
          leaf.label = `${reference.name} (${totalCollection})`;
        } else {
          leaf.label = reference.name;
        }
      }

      // the rest
      if (size === 0) {
        leaf.radius = 0.666;
        leaf.highlighted = false;
        leaf.interactive = false;
      } else {
        let isVisible = !filter.active;
        let isHighlighted = false;

        if (filter.active) {
          isVisible = includesFp(genomes, filter.ids, id);
        }

        isHighlighted = includesFp(genomes, highlightedIds, id);

        leaf.radius = isVisible ? 1 : 0;
        leaf.highlighted = isHighlighted;
        leaf.interactive = status === 'READY';
      }
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
