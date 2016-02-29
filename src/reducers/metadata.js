import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_LABEL_COLUMN, setLabelColumn } from '../actions/table';
import { SET_TREE } from '../actions/tree';

import { systemColumnProps } from '../constants/metadata';
import { getCellContents } from '../constants/table';
import { speciesTrees } from '../constants/tree';

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
  subtreeMetadataColumnNames: {},
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
      getCellContents,
    };
  });
}

function createColumnProps(assemblies) {
  const columnNames = getUserDefinedColumnNames(assemblies);
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

      const userDefinedColumnProps = createColumnProps(assemblies);

      return {
        ...state,
        userDefinedColumnProps,
        columns: userDefinedColumnProps,
      };
    }

    return state;
  },
  [SET_TREE]: function (state, { ready, result, name }) {
    if (ready === false) {
      return state;
    }

    if (ready && result) {
      const { assemblies } = result;

      const subtreeMetadataColumnProps = createColumnProps(assemblies);

      return {
        ...state,
        subtreeMetadataColumnProps: {
          ...state.subtreeMetadataColumnProps,
          [name]: subtreeMetadataColumnProps,
        },
        columns: subtreeMetadataColumnProps,
        activeColumn: getActiveColumn(state.activeColumn, subtreeMetadataColumnProps),
      };
    }

    const userDefinedColumnProps =
      speciesTrees.has(name) ?
        state.userDefinedColumnProps :
        state.subtreeMetadataColumnProps[name];

    return {
      ...state,
      columns: userDefinedColumnProps,
      activeColumn: getActiveColumn(state.activeColumn, userDefinedColumnProps),
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
