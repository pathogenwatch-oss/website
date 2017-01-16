import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import * as selectors from './selectors';
import * as actions from './thunks';

import { POPULATION, COLLECTION } from '../../app/stateKeys/tree';

const icons = {
  [COLLECTION]: 'person',
  [POPULATION]: 'language',
};

const Header = ({ tree, singleTree, isSubtree, displayTree }) => {
  const switcher =
    singleTree ?
    <div className="wgsa-tree-icon mdl-button mdl-button--icon">
      <i className="material-icons">{icons[singleTree]}</i>
    </div> :
    <div className="wgsa-button-group mdl-shadow--2dp">
      <i className="material-icons" title="View">visibility</i>
      <button
        className={classnames({ active: tree.name === COLLECTION })}
        onChange={() => displayTree(COLLECTION)}
      >
        Collection
      </button>
      <button
        className={classnames({ active: tree.name === POPULATION })}
        onChange={() => displayTree(POPULATION)}
      >
        Population
      </button>
    </div>;

  return (
    <header className="wgsa-tree-header">
      { isSubtree ?
        <button
          className="wgsa-tree-icon mdl-button mdl-button--icon"
          onClick={() => displayTree(POPULATION)}
        >
          <i className="material-icons">arrow_back</i>
        </button> :
        switcher
      }
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
    displayTree: tree => dispatch(actions.displayTree(tree)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
