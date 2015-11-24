import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_LABEL_COLUMN, setLabelColumn } from '../actions/columns';

import { systemColumnProps, getCellContents } from '../constants/metadata';

const initialState = { columns: [] };

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
        columns,
        headerClick(column, display) {
          if (display.labelcolumn === column) {
            return setLabelColumn(systemColumnProps[1]);
          }
          return setLabelColumn(column);
        },
      };
    }

    return state;
  },
  [SET_LABEL_COLUMN]: function (state, { column }) {
    return {
      ...state,
      columns: state.columns.map(function (previous) {
        return {
          ...previous,
          selected: column.columnKey === previous.columnKey,
        };
      }),
    };
  },

};

export default { actions, initialState };
