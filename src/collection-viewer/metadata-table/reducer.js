import { FETCH_COLLECTION } from '../../collection-route/actions';
import { SET_LABEL_COLUMN, setLabelColumn } from './actions';

import { getMetadataTable } from '../table/selectors';

import { downloadColumnProps, nameColumnProps } from '../table/constants';
import { getUserDefinedValue, getSystemDataColumnProps } from './utils';

import Species from '../../species';

const initialActiveColumn = nameColumnProps;

const initialState = {
  activeColumn: initialActiveColumn,
  columns: [],
  onHeaderClick(event, column) {
    return (dispatch, getState) => {
      const state = getState();
      const { activeColumn } = getMetadataTable(state);

      dispatch(setLabelColumn(
        activeColumn === column ? initialActiveColumn : column
      ));
    };
  },
};

function getUserDefinedColumnNames(genomes) {
  const userDefinedColumnNames = new Set();
  genomes.forEach(genome => {
    if (genome.userDefined) {
      Object.keys(genome.userDefined).
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
      const { genomes } = payload.result;
      const { uiOptions = {} } = Species.current;

      const systemColumnProps = [
        downloadColumnProps,
        nameColumnProps,
        ...getSystemDataColumnProps(uiOptions),
      ];
      const columnNames = getUserDefinedColumnNames(genomes);

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
