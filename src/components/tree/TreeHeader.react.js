import React from 'react';

import Switch from '../Switch.react';

import { displayTree } from '^/actions/tree';

import { POPULATION, COLLECTION } from '^/constants/tree';

const speciesTrees = new Set([ POPULATION, COLLECTION ]);
const titles = {
  [POPULATION]: 'Population',
  [COLLECTION]: 'Collection',
};

export default ({ tree, dispatch }) => (
  <header className="wgsa-tree-header">
    { speciesTrees.has(tree) ?
      <div className="wgsa-switch-background wgsa-switch-background--see-through">
        <Switch
          id="tree-switcher"
          left={{ title: 'Population Tree', icon: 'nature' }}
          right={{ title: 'Collection Tree', icon: 'nature_people' }}
          checked={tree === COLLECTION}
          onChange={(checked) =>
            dispatch(displayTree(checked ? COLLECTION : POPULATION))} />
      </div> :
      <button
        className="wgsa-tree-return mdl-button mdl-button--icon"
        onClick={() => dispatch(displayTree(POPULATION))}>
        <i className="material-icons">arrow_back</i>
      </button>

    }
    <h2 className="wgsa-tree-heading">
      <span>{speciesTrees.has(tree) ? titles[tree] : tree}</span>
    </h2>
  </header>
);
