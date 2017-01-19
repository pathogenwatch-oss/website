import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import * as selectors from './selectors';
import * as actions from './thunks';

import { POPULATION, COLLECTION } from '../../app/stateKeys/tree';

function mapStateToButtonProps(state) {
  return {
    visibleTreeName: selectors.getVisibleTree(state).name,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    displayTree: tree => dispatch(actions.displayTree(tree)),
  };
}

const Button = connect(mapStateToButtonProps, mapDispatchToProps)(
  ({ visibleTreeName, displayTree, treeName, children }) => (
    <button
      className={classnames(
        'wgsa-button-group__item',
        { active: visibleTreeName === treeName }
      )}
      onClick={() => displayTree(treeName)}
    >
      {children}
    </button>
  )
);

const Header = ({ singleTree, lastSubtree }) => (
  <header className="wgsa-tree-header">
    <div className="wgsa-button-group mdl-shadow--2dp">
      <i className="material-icons" title="View">visibility</i>
      { (!singleTree || singleTree === COLLECTION) &&
        <Button treeName={COLLECTION}>Collection</Button>
      }
      { (!singleTree || singleTree === POPULATION) &&
        <Button treeName={POPULATION}>Population</Button>
      }
      { lastSubtree &&
        <Button treeName={lastSubtree.name}>{lastSubtree.title}</Button>
      }
    </div>
  </header>
);

function mapStateToProps(state) {
  return {
    singleTree: selectors.getSingleTree(state),
    lastSubtree: selectors.getLastSubtree(state),
  };
}

export default connect(mapStateToProps)(Header);
