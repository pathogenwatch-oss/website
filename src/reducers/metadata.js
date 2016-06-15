import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_LABEL_COLUMN, setLabelColumn } from '../actions/table';
import { SET_TREE } from '../actions/tree';

import { getSystemColumnProps } from '../constants/metadata';
import { nameColumnProps, getCellContents } from '../constants/table';
import { speciesTrees } from '../constants/tree';

import Species from '^/species';

const initialActiveColumn = nameColumnProps;

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

function getUserDefinedColumnProps(columnNames) {
  return Array.from(columnNames).map(column => ({
    columnKey: column,
    valueGetter({ metadata }) {
      return metadata.userDefined[column];
    },
    getCellContents,
  }));
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
      const { publicMetadataColumnNames = [], uiOptions = {} } = Species.current;

      const columnNames = getUserDefinedColumnNames(assemblies);
      const systemColumnProps = getSystemColumnProps(uiOptions);
      const userDefinedColumnProps =
        systemColumnProps.concat(getUserDefinedColumnProps(columnNames));

      return {
        ...state,
        userDefinedColumnProps,
        publicMetadataColumnProps:
          publicMetadataColumnNames.length ?
            systemColumnProps.concat(
              getUserDefinedColumnProps(publicMetadataColumnNames)
            ) :
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
