import { FETCH_ENTITIES } from '../../actions/fetch';
import { SET_LABEL_COLUMN } from '../table/actions';
import { SET_TREE } from '../tree/actions';

import { initialActiveColumn, onHeaderClick } from './utils';

import { downloadColumnProps, nameColumnProps, tableKeys } from '../table/constants';
import * as metadata from './constants';

import { speciesTrees } from '../tree/constants';

import Species from '../../species';

const initialState = {
  name: tableKeys.metadata,
  activeColumn: initialActiveColumn,
  columns: [],
  onHeaderClick,
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
      const { publicMetadataColumnNames = [] } = Species.current;

      const columnNames = getUserDefinedColumnNames(assemblies);
      const systemColumnProps = [
        downloadColumnProps,
        nameColumnProps,
        metadata.systemDataColumns.__date,
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
    case SET_LABEL_COLUMN: {
      if (payload.table !== state.name) return state;
      return {
        ...state,
        activeColumn: payload.column,
      };
    }
    default:
      return state;
  }
}
