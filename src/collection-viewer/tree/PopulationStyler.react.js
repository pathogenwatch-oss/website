import React from 'react';
import { connect } from 'react-redux';

import { getAssemblies } from '../../collection-route/selectors';
import { getFilter } from '../selectors';
import { getTrees } from './selectors';

import { leafStyles, defaultLeafStyle } from './constants';
import { CGPS } from '../../app/constants';

const Styler = React.createClass({

  componentDidUpdate() {
    const { phylocanvas, assemblies, trees, filter } = this.props;

    for (const leaf of phylocanvas.leaves) {
      const { id } = leaf;
      const assembly = assemblies[id];
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
      leaf.label = `${assembly.name} (${totalCollection}) [${totalPublic}]`;
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
    assemblies: getAssemblies(state),
    trees: getTrees(state),
    filter: getFilter(state),
  };
}

export default connect(mapStateToProps)(Styler);
