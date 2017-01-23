import { FETCH_COLLECTION } from '../../collection-route/actions';
import { SET_LABEL_COLUMN } from '../table/actions';
import { SET_TREE } from '../tree/actions';
import { onHeaderClick } from './thunks';

import { getUserDefinedValue } from '../table/utils';
import { hasMetadata } from './utils';

import { speciesTrees } from '../tree/constants';
import * as table from '../table/constants';
import { systemDataColumns } from './constants';

import Species from '../../species';

const { tableKeys } = table;

const initialState = {
  name: tableKeys.metadata,
  activeColumn: table.nameColumnProps,
  columns: [],
  onHeaderClick,
  active: true,
};

function getUserDefinedColumnNames(genomes) {
  const columnNames = new Set();
  genomes.forEach(genome => {
    if (genome.userDefined) {
      Object.keys(genome.userDefined).
        filter(name => name.length && !/__colou?r$/.test(name)).
        forEach(name => columnNames.add(name));
    }
  });
  return columnNames;
}

function getUserDefinedColumnProps(columnNames) {
  return Array.from(columnNames).map(column => ({
    columnKey: column,
    valueGetter(data) {
      return getUserDefinedValue(column, data);
    },
  }));
}

function getActiveColumn(currentActiveColumn, newColumns) {
  if (newColumns.indexOf(currentActiveColumn) !== -1) {
    return currentActiveColumn;
  }
  return table.nameColumnProps;
}

const leftSystemColumnProps = [
  table.leftSpacerColumn,
  table.downloadColumnProps,
  table.nameColumnProps,
  systemDataColumns.__date,
];

const rightSystemColumnProps = [
  systemDataColumns.__pmid,
  table.rightSpacerColumn,
];

export default function (state = initialState, { type, payload }) {
  if (!state.active) return state;
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { genomes } = payload.result;
      const { publicMetadataColumnNames = [] } = Species.current;

      if (!hasMetadata(genomes)) {
        return {
          ...state,
          active: false,
        };
      }

      const columnNames = getUserDefinedColumnNames(genomes);
      const columnProps = [
        ...leftSystemColumnProps,
        ...getUserDefinedColumnProps(columnNames),
        ...rightSystemColumnProps,
      ];

      return {
        ...state,
        columnProps,
        publicMetadataColumnProps:
          publicMetadataColumnNames.length ?
            [ ...leftSystemColumnProps,
              ...getUserDefinedColumnProps(publicMetadataColumnNames),
              ...rightSystemColumnProps,
            ] :
            columnProps,
        columns: columnProps,
      };
    }
    case SET_TREE: {
      const columnProps =
        speciesTrees.has(payload.name) ?
          state.columnProps :
          state.publicMetadataColumnProps;

      return {
        ...state,
        columns: columnProps,
        activeColumn: getActiveColumn(state.activeColumn, columnProps),
      };
    }
    case SET_LABEL_COLUMN: {
      if (payload.table !== tableKeys.metadata) return state;
      return {
        ...state,
        activeColumn: payload.column,
      };
    }
    default:
      return state;
  }
}
