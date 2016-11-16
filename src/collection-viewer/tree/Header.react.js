import React from 'react';
import { connect } from 'react-redux';

import Switch from '../../components/Switch.react';

import * as selectors from './selectors';
import { displayTree } from './thunks';

import { POPULATION, COLLECTION } from '../../app/stateKeys/tree';

const icons = {
  [COLLECTION]: 'person',
  [POPULATION]: 'language',
};

const Header = ({ tree, title, singleTree, isSubtree, onSwitchChange, onBackButtonClick }) => {
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
        onChange={onSwitchChange}
      />
    </div>;

  return (
    <header className="wgsa-tree-header">
      { isSubtree ?
        <button
          className="wgsa-tree-icon mdl-button mdl-button--icon"
          onClick={onBackButtonClick}
        >
          <i className="material-icons">arrow_back</i>
        </button> :
        switcher
      }
      <h2 className="wgsa-tree-heading">
        <span>{title}</span>
      </h2>
    </header>
  );
};

function mapStateToProps(state) {
  return {
    singleTree: selectors.getSingleTree(state),
    tree: selectors.getVisibleTree(state),
    title: selectors.getTitle(state),
    isSubtree: selectors.isSubtree(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSwitchChange: checked =>
      dispatch(displayTree(checked ? POPULATION : COLLECTION)),
    onBackButtonClick: () => dispatch(displayTree(POPULATION)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
