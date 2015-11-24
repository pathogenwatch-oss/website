import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_LABEL_GETTER, setLabelGetter } from '../actions/getters';

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
      labelGetter({ metadata }) {
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
        headerClick({ labelGetter }, display) {
          if (display.labelGetter === labelGetter) {
            return setLabelGetter(systemColumnProps[1].labelGetter);
          }
          return setLabelGetter(labelGetter);
        },
      };
    }

    return state;
  },
  [SET_LABEL_GETTER]: function (state, { getter }) {
    return {
      ...state,
      columns: state.columns.map(function (column) {
        return {
          ...column,
          selected: getter === column.labelGetter,
        };
      }),
    };
  },
};

export default { actions, initialState };
