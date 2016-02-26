import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_LABEL_COLUMN, setLabelColumn } from '../actions/table';
import { SET_TREE } from '../actions/tree';

import { systemColumnProps } from '../constants/metadata';
import { getCellContents } from '../constants/table';

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

const userDefinedColumnNames = new Set();

function getUserDefinedColumns(assemblies) {
  Object.keys(assemblies).forEach(key => {
    const { userDefined } = assemblies[key].metadata;
    if (userDefined) {
      Object.keys(userDefined).forEach(name => userDefinedColumnNames.add(name));
    }
  });
}

function buildUserDefinedColumnProps() {
  return Array.from(userDefinedColumnNames).map((column) => {
    return {
      columnKey: column,
      valueGetter({ metadata }) {
        return metadata.userDefined[column];
      },
      getCellContents,
    };
  });
}

function updateUserDefinedColumns(assemblies) {
  getUserDefinedColumns(assemblies);
  return systemColumnProps.concat(buildUserDefinedColumnProps());
}


const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (ready && !error) {
      const { assemblies } = result[0];

      return {
        ...state,
        columns: updateUserDefinedColumns(assemblies),
      };
    }

    return state;
  },
  [SET_TREE]: function (state, { ready, result }) {
    if (ready && result) {
      const { assemblies } = result;

      return {
        ...state,
        columns: updateUserDefinedColumns(assemblies),
      };
    }

    return state;
  },
  [SET_LABEL_COLUMN]: function (state, { column }) {
    return {
      ...state,
      activeColumn: column,
    };
  },

};

export default { actions, initialState };
