import React from 'react';
import { connect } from 'react-redux';

import { getFilter } from '../selectors';
import { getTrees } from './selectors';

import { leafStyles, defaultLeafStyle } from './constants';
import { CGPS } from '../../app/constants';
import { POPULATION } from '../../app/stateKeys/tree';

const Styler = React.createClass({

  componentDidUpdate(previous) {
    const { phylocanvas, assemblies, subtrees, filter, treeType } = this.props;

    for (const leaf of phylocanvas.leaves) {
      const { id } = leaf;
      const assembly = assemblies[id];
      const subtree = subtrees[id];
      const { assemblyIds = [], publicCount = 0 } = subtree || {};

      leaf.setDisplay({
        ...(subtree ? leafStyles.subtree : leafStyles.reference),
        leafStyle: {
          ...defaultLeafStyle,
          fillStyle: subtree ? CGPS.COLOURS.PURPLE_LIGHT : CGPS.COLOURS.GREY,
        },
      });
      leaf.label = `${assembly.metadata.assemblyName} (${assemblyIds.length}) [${publicCount}]`;
      leaf.highlighted = (filter.active &&
        assemblyIds.some(assemblyId => filter.ids.has(assemblyId)));
      leaf.interactive = !!subtree;
    }

    if (treeType !== previous.treeType) {
      phylocanvas.setTreeType(treeType);
    } else {
      phylocanvas.draw();
    }
  },

  render() {
    return null;
  },

});

function mapStateToProps(state) {
  return {
    treeType: getTrees(state)[POPULATION].treeType,
    assemblies: state.entities.assemblies,
    subtrees: state.collection.subtrees,
    filter: getFilter,
  };
}

export default connect(mapStateToProps)(Styler);
