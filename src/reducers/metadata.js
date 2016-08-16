import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_LABEL_COLUMN, setLabelColumn } from '../actions/table';
import { SET_TREE } from '../actions/tree';

import { systemColumnProps } from '../constants/metadata';
import { speciesTrees } from '../constants/tree';

import Species from '^/species';

const initialActiveColumn = systemColumnProps[1];

const initialState = {
  activeColumn: initialActiveColumn,
  headerClick(column) {
    if (this.activeColumn === column) {
      return setLabelColumn(initialActiveColumn);
    }
    return setLabelColumn(column);
  },
  columns: [],
};

function getUserDefinedColumnNames(assemblies) {
  const userDefinedColumnNames = new Set();
  Object.keys(assemblies).forEach(key => {
    const { userDefined } = assemblies[key].metadata;
    if (userDefined) {
      Object.keys(userDefined).forEach(name => userDefinedColumnNames.add(name));
    }
  });
  return userDefinedColumnNames;
}

function buildUserDefinedColumnProps(columnNames) {
  return Array.from(columnNames).map((column) => {
    return {
      columnKey: column,
      valueGetter({ metadata }) {
        return metadata.userDefined[column];
      },
    };
  });
}

function createColumnProps(columnNames) {
  return systemColumnProps.concat(buildUserDefinedColumnProps(columnNames));
}

function getActiveColumn(currentActiveColumn, newColumns) {
  if (newColumns.indexOf(currentActiveColumn) !== -1) {
    return currentActiveColumn;
  }

  return initialActiveColumn;
}

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (ready && !error) {
      const { assemblies } = result[0];
      const { publicMetadataColumnNames = [] } = Species.current;

      const columnNames = getUserDefinedColumnNames(assemblies);
      const userDefinedColumnProps = createColumnProps(columnNames);

      return {
        ...state,
        userDefinedColumnProps,
        publicMetadataColumnProps:
          publicMetadataColumnNames.length ?
            createColumnProps(publicMetadataColumnNames) :
            userDefinedColumnProps,
        columns: userDefinedColumnProps,
      };
    }

    return state;
  },
  [SET_TREE]: function (state, { ready, name }) {
    if (ready === false) {
      return state;
    }

    const columnProps =
      speciesTrees.has(name) ?
        state.userDefinedColumnProps :
        state.publicMetadataColumnProps;

    return {
      ...state,
      columns: columnProps,
      activeColumn: getActiveColumn(state.activeColumn, columnProps),
    };
  },
  [SET_LABEL_COLUMN]: function (state, { column }) {
    return {
      ...state,
      activeColumn: column,
    };
  },

};

export default { actions, initialState };
