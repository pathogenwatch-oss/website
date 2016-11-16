import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_LABEL_COLUMN, setLabelColumn } from '../actions/table';
import { SET_TREE } from '../collection-viewer/tree/actions';

import { downloadColumnProps, nameColumnProps } from '../constants/table';
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

const actions = {
  [FETCH_ENTITIES.SUCCESS](state, { result }) {
    const [ { assemblies } ] = result;
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
  },
  [SET_TREE](state, { name }) {
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
  [SET_LABEL_COLUMN](state, { column }) {
    return {
      ...state,
      activeColumn: column,
    };
  },

};

export default { actions, initialState };
