import { FETCH_COLLECTION } from '../../collection-route/actions';
import { SET_LABEL_COLUMN, setLabelColumn } from './actions';

import { downloadColumnProps, nameColumnProps } from '../table/constants';
import { getUserDefinedValue, getSystemDataColumnProps } from './utils';

import Species from '../../species';

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
  assemblies.forEach(assembly => {
    if (assembly.userDefined) {
      Object.keys(assembly.userDefined).
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
      return getUserDefinedValue(column, data);
    },
  }));
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { assemblies } = payload.result;
      const { uiOptions = {} } = Species.current;

      const systemColumnProps = [
        downloadColumnProps,
        nameColumnProps,
        ...getSystemDataColumnProps(uiOptions),
      ];
      const columnNames = getUserDefinedColumnNames(assemblies);

      return {
        ...state,
        columns:
          systemColumnProps.concat(getUserDefinedColumnProps(columnNames)),
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
