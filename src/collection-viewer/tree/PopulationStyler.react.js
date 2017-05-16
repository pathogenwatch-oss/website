import React from 'react';
import { connect } from 'react-redux';

import { getGenomes } from '../../collection-viewer/selectors';
import { getFilter } from '../selectors';
import { getTrees } from './selectors';

import { leafStyles, defaultLeafStyle } from './constants';
import { CGPS } from '../../app/constants';

const Styler = React.createClass({

  componentDidUpdate() {
    const { phylocanvas, genomes, trees, filter } = this.props;

    for (const leaf of phylocanvas.leaves) {
      const { id } = leaf;
      const genome = genomes[id];
      const subtree = trees[id];
      const { leafIds = [], totalCollection = 0, totalPublic = 0 } =
        subtree || {};

      leaf.setDisplay({
        ...(subtree ? leafStyles.subtree : leafStyles.reference),
        leafStyle: {
          ...defaultLeafStyle,
          fillStyle: subtree ? CGPS.COLOURS.PURPLE_LIGHT : CGPS.COLOURS.GREY,
        },
      });

      if (totalCollection > 0) {
        leaf.label = `${genome.name} (${totalCollection}) [${totalPublic}]`;
      } else {
        leaf.label = genome.name;
      }

      leaf.highlighted = (filter.active &&
        leafIds.some(uuid => filter.ids.has(uuid)));
      leaf.interactive = !!subtree;
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
    filter: getFilter(state),
  };
}

export default connect(mapStateToProps)(Styler);
