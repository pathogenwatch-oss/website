import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_LABEL_COLUMN, setLabelColumn } from '../actions/table';

import { systemColumnProps, getCellContents } from '../constants/metadata';

const initialActiveColumn = systemColumnProps[0];

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

function getUserDefinedColumns(assemblies) {
  const ids = Object.keys(assemblies);
  const { userDefined } = assemblies[ids[0]].metadata;

  return userDefined ? Object.keys(userDefined) : [];
}

function buildUserDefinedColumnProps(assemblies) {
  return getUserDefinedColumns(assemblies).map((column) => {
    return {
      columnKey: column,
      valueGetter({ metadata }) {
        return metadata.userDefined[column];
      },
      getCellContents,
    };
  });
}

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (ready && !error) {
      const { assemblies } = result[0];
      const columns =
        systemColumnProps.concat(buildUserDefinedColumnProps(assemblies));

      return {
        ...state,
        columns,
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
