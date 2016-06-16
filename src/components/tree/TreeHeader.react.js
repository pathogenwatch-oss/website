import React from 'react';

import Switch from '../Switch.react';

import { displayTree } from '^/actions/tree';

import { POPULATION, COLLECTION } from '^/constants/tree';

const icons = {
  [COLLECTION]: 'person',
  [POPULATION]: 'language',
};

export default ({ tree, title, isSpecies, singleTree, dispatch }) => {
  const switcher =
    singleTree ?
    <div className="wgsa-tree-icon mdl-button mdl-button--icon">
      <i className="material-icons">{icons[singleTree]}</i>
    </div> :
    <div className="wgsa-switch-background wgsa-switch-background--see-through">
      <Switch
        id="tree-switcher"
        left={{ title: 'Collection View', icon: icons[COLLECTION] }}
        right={{ title: 'Population View', icon: icons[POPULATION] }}
        checked={tree.name === POPULATION}
        onChange={(checked) => dispatch(
          displayTree(
            checked ? { name: POPULATION } : { name: COLLECTION }
          )
        )}
      />
    </div>;

  return (
    <header className="wgsa-tree-header">
      { isSpecies ?
          switcher :
          <button
            className="wgsa-tree-icon mdl-button mdl-button--icon"
            onClick={() => dispatch(displayTree({ name: POPULATION }))}
          >
            <i className="material-icons">arrow_back</i>
          </button>
      }
      <h2 className="wgsa-tree-heading">
        <span>{title}</span>
      </h2>
    </header>
  );
};
