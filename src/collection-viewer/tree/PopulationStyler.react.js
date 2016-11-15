import React from 'react';
import { connect } from 'react-redux';

import { getFilter } from '../selectors';

import { leafStyles, defaultLeafStyle } from './constants';
import { CGPS } from '../../app/constants';

const Styler = React.createClass({

  componentDidUpdate() {
    const { phylocanvas, assemblies, subtrees, filter } = this.props;

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

    phylocanvas.draw();
  },

  render() {
    return null;
  },

});

function mapStateToProps(state) {
  return {
    assemblies: state.entities.assemblies,
    subtrees: state.collection.subtrees,
    filter: getFilter(state),
  };
}

export default connect(mapStateToProps)(Styler);
