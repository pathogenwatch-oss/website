import React from 'react';

import Switch from '../Switch.react';

import { displayTree } from '^/actions/tree';

import { POPULATION, COLLECTION } from '^/constants/tree';

export default ({ tree, title, isSpecies, hasCollectionTree, dispatch }) => (
  <header className="wgsa-tree-header">
    { isSpecies ?
        hasCollectionTree ?
        <div className="wgsa-switch-background wgsa-switch-background--see-through">
          <Switch
            id="tree-switcher"
            left={{ title: 'Collection View', icon: 'person' }}
            right={{ title: 'Population View', icon: 'language' }}
            checked={tree.name === POPULATION}
            onChange={(checked) => dispatch(
              displayTree(
                checked ? { name: POPULATION } : { name: COLLECTION }
              )
            )}
          />
        </div> :
        <div className="wgsa-tree-icon mdl-button mdl-button--icon">
          <i className="material-icons">language</i>
        </div>
      :
      <button
        className="wgsa-tree-icon mdl-button mdl-button--icon"
        onClick={() => dispatch(displayTree({ name: POPULATION }))}>
        <i className="material-icons">arrow_back</i>
      </button>
    }
    <h2 className="wgsa-tree-heading">
      <span>{title}</span>
    </h2>
  </header>
);
