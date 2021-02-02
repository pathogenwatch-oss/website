import React from 'react';
import { connect } from 'react-redux';

import MenuButton from '@cgps/libmicroreact/menu-button';
import DropdownMenu from '@cgps/libmicroreact/dropdown-menu';

import { getSingleTree } from '../selectors';
import { getVisibleTreeLabel } from './selectors';
import { getSubtreeMenuItems } from './selectors/entities';

import * as actions from './thunks';

import { POPULATION, COLLECTION } from '~/app/stateKeys/tree';

const Header = ({ singleTree, displayTree, subtrees, visibleTree }) => {
  if (singleTree === COLLECTION) return null;
  return (
    <header className="wgsa-tree-header">
      <DropdownMenu
        button={
          <MenuButton>
            {visibleTree}
          </MenuButton>
        }
      >
        {!singleTree &&
          <button onClick={() => displayTree(COLLECTION)}>
            Collection
          </button>
        }
        {(!singleTree || singleTree === POPULATION) &&
          <button onClick={() => displayTree(POPULATION)}>
            Population
          </button>
        }
        <hr />
        {subtrees.map(([ key, label ]) =>
          (<button onClick={() => displayTree(key)}>
            {label}
          </button>)
        )}
      </DropdownMenu>
    </header>
  );
};

function mapStateToProps(state) {
  return {
    singleTree: getSingleTree(state),
    visibleTree: getVisibleTreeLabel(state),
    subtrees: getSubtreeMenuItems(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    displayTree: tree => dispatch(actions.displayTree(tree)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
