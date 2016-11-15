import React from 'react';
import { treeTypes } from 'phylocanvas';
import { connect } from 'react-redux';

import { isLoaded, getBaseSize, getTreeScales } from './selectors';
import { setTreeType, setNodeScale, setLabelScale } from './actions';

const Controls = React.createClass({

  propTypes: {
    scales: React.PropTypes.object,
    treeType: React.PropTypes.string,
    onNodeScaleChange: React.PropTypes.func,
    onLabelScaleChange: React.PropTypes.func,
    onTreeTypeChange: React.PropTypes.func,
  },

  componentDidMount() {
    const { nodeSlider, labelSlider } = this.refs;
    componentHandler.upgradeElements([ nodeSlider, labelSlider ]);
  },

  componentDidUpdate(previous) {
    const { nodeSlider, labelSlider } = this.refs;
    const { scales, baseSize, phylocanvas } = this.props;

    if (baseSize && (scales !== previous.scales || !previous.loaded)) {
      nodeSlider.MaterialSlider.change(scales.node);
      phylocanvas.baseNodeSize = baseSize * scales.node;

      labelSlider.MaterialSlider.change(scales.label);
      phylocanvas.textSize = baseSize * scales.label;
    }
  },

  render() {
    return null;
  },

});

export const getPopulationTreeLeafProps = createSelector(
  state => getTrees(state)[POPULATION],
  ({ entities }) => entities.assemblies,
  ({ collection }) => collection.subtrees,
  getFilter,
  ({ leafIds }, assemblies, subtrees, { active, ids }) =>
    leafIds.reduce((props, leafId) => {
      const assembly = assemblies[leafId];
      const subtree = subtrees[leafId];
      const { assemblyIds = [], publicCount = 0 } = subtree || {};
      props[leafId] = {
        display: subtrees[leafId] ? leafStyles.subtree : leafStyles.reference,
        colour: subtree ? CGPS.COLOURS.PURPLE_LIGHT : CGPS.COLOURS.GREY,
        label: `${assembly.metadata.assemblyName} (${assemblyIds.length}) [${publicCount}]`,
        highlighted: (active && assemblyIds.some(id => ids.has(id))),
        interactive: !!subtree,
      };
      return props;
    }, {})
);

export const getStandardLeafProps = createSelector(
  getVisibleTree,
  ({ entities }) => entities.assemblies,
  getColourGetter,
  ({ tables }) => tables.metadata.activeColumn.valueGetter,
  getFilter,
  ({ leafIds }, assemblies, getColour, getLabel, { active, ids }) =>
    leafIds.reduce((props, id) => {
      const assembly = assemblies[id];
      props[id] = {
        display: utils.getLeafStyle(assembly),
        colour: getColour(assembly),
        label: getLabel(assembly),
        highlighted: active && ids.has(id),
      };
      return props;
    }, {})
);

const PopulationStyle = connect(state => ({
  tree: getTrees(state)[POPULATION],
  assemblies: state.entities.assemblies,
  subtrees: state.collection.subtrees,
  filter: getFilter,
}))(React.createClass({

  shouldComponentUpdate(nextProps, nextState) {

  },

}));

function mapStateToProps(state, { stateKey ) {
  if (stateKey === POPULATION) {
    return {

    }
  }

  return {
    loaded: isLoaded(state),
    baseSize: getBaseSize(state),
    scales: getTreeScales(state),
  };
}

export default ({ stateKey }) => (
  stateKey === POPULATION ?
    <PopulationStyle /> :
    <StandardStyle />
);
