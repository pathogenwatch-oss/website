import React from 'react';
import { connect } from 'react-redux';

import Tree from '../tree/Tree.react';
import Switch from '../Switch.react';

import { switchTree } from '^/actions/tree';

import { POPULATION, COLLECTION, getTreeProps } from '^/constants/tree';

const SpeciesTree = React.createClass({

  displayName: 'SpeciesTree',

  propTypes: {
    assemblies: React.PropTypes.object,
    visibleAssemblyIds: React.PropTypes.array,
    subtrees: React.PropTypes.object,
    trees: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    displayedTree: React.PropTypes.any,
  },

  getInitialState() {
    return {
      tree: POPULATION,
    };
  },

  componentWillMount() {
    this.treeProps = getTreeProps[POPULATION](this.props);
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tree !== this.state.tree) {
      FilteredDataActionCreators.setBaseAssemblyIds(
        Object.keys(this.props.assemblies)
      );
    }
  },

  render() {
    const { displayedTree, trees, dispatch } = this.props;
    return (
      <Tree
        { ...getTreeProps[displayedTree](this.props) }
        newick={trees[displayedTree]}
        navButton={
          <div className="wgsa-switch-background wgsa-switch-background--see-through">
            <Switch
              id="tree-switcher"
              left={{ title: 'Population Tree', icon: 'nature' }}
              right={{ title: 'Collection Tree', icon: 'nature_people' }}
              checked={displayedTree === COLLECTION}
              onChange={(checked) =>
                dispatch(switchTree(checked ? COLLECTION : POPULATION))} />
          </div>
        } />
    );
  },

});

function mapStateToProps({ entities, display, filter }) {
  const { assemblies, trees, subtrees } = entities;
  return {
    assemblies,
    subtrees,
    trees,
    displayedTree: display.tree,
    filter,
  };
}

export default connect(mapStateToProps)(SpeciesTree);
