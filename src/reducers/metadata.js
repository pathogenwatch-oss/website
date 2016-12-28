import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_LABEL_COLUMN, setLabelColumn } from '../collection-viewer/table/actions';
import { SET_TREE } from '../collection-viewer/tree/actions';

import { downloadColumnProps, nameColumnProps } from '../collection-viewer/table/constants';
import * as metadata from '../constants/metadata';

import { speciesTrees } from '../collection-viewer/tree/constants';

import Species from '../species';

const initialActiveColumn = nameColumnProps;

const initialState = {
  activeColumn: initialActiveColumn,
  columns: [],
  onHeaderClick(event, { column, activeColumns }, dispatch) {
    dispatch(setLabelColumn(
      activeColumns.has(column) ? initialActiveColumn : column
    ));
  },
};

function getUserDefinedColumnNames(assemblies) {
  const userDefinedColumnNames = new Set();
  Object.keys(assemblies).forEach(key => {
    const { userDefined } = assemblies[key].metadata;
    if (userDefined) {
      Object.keys(userDefined).
        filter(name => !/__colou?r$/.test(name)).
        forEach(name => userDefinedColumnNames.add(name));
    }
  });
  return userDefinedColumnNames;
}

function getUserDefinedColumnProps(columnNames) {
  return Array.from(columnNames).map(column => ({
    columnKey: column,
    valueGetter(data) {
      return metadata.getUserDefinedValue(column, data);
    },
  }));
}

function getActiveColumn(currentActiveColumn, newColumns) {
  if (newColumns.indexOf(currentActiveColumn) !== -1) {
    return currentActiveColumn;
  }
  return initialActiveColumn;
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_ENTITIES.SUCCESS: {
      const [ { assemblies } ] = payload.result;
      const { publicMetadataColumnNames = [], uiOptions = {} } = Species.current;

      const columnNames = getUserDefinedColumnNames(assemblies);
      const systemColumnProps = [
        downloadColumnProps,
        nameColumnProps,
        ...metadata.getSystemDataColumnProps(uiOptions),
      ];
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
    case SET_TREE: {
      const columnProps =
        speciesTrees.has(payload.name) ?
          state.userDefinedColumnProps :
          state.publicMetadataColumnProps;

      return {
        ...state,
        columns: columnProps,
        activeColumn: getActiveColumn(state.activeColumn, columnProps),
      };
    }
    case SET_LABEL_COLUMN:
      return {
        ...state,
        activeColumn: payload.column,
      };
    default:
      return state;
  }
}
