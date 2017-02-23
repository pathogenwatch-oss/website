import { FETCH_COLLECTION } from '../../collection-viewer/actions';
import { SET_LABEL_COLUMN } from '../table/actions';
import { SET_TREE } from '../tree/actions';
import { onHeaderClick } from './thunks';

import { getUserDefinedValue } from '../table/utils';
import { hasMetadata } from './utils';

import { speciesTrees } from '../tree/constants';
import * as table from '../table/constants';
import { systemDataColumns } from './constants';
import { tableKeys } from '../constants';
import { statuses } from '../../collection-viewer/constants';

import Species from '../../species';

const initialState = {
  name: tableKeys.metadata,
  activeColumn: table.nameColumnProps,
  columns: [],
  onHeaderClick,
  active: true,
};

function getColumnNames(genomes) {
  const leading = new Set();
  const userDefined = new Set();
  const trailing = new Set();
  genomes.forEach(genome => {
    if (genome.userDefined) {
      Object.keys(genome.userDefined).
        filter(name => name.length && !/__colou?r$/.test(name)).
        forEach(name => userDefined.add(name));
    }
    if (genome.date) {
      leading.add('__date');
    }
    if (genome.pmid) {
      trailing.add('__pmid');
    }
  });
  return { leading, userDefined, trailing };
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

function getLeadingSystemColumnProps(columnNames) {
  return [
    table.leftSpacerColumn,
    table.downloadColumnProps,
    table.nameColumnProps,
  ].concat(Array.from(columnNames).map(name => systemDataColumns[name]));
}

function getTrailingSystemColumnProps(columnNames) {
  return (
    Array.from(columnNames).map(name => systemDataColumns[name]).
      concat([
        table.rightSpacerColumn,
      ])
  );
}

export default function (state = initialState, { type, payload }) {
  if (!state.active) return state;
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { genomes, status } = payload.result;

      if (status !== statuses.READY) return state;

      const { publicMetadataColumnNames = [] } = Species.current;

      if (!hasMetadata(genomes)) {
        return {
          ...state,
          active: false,
        };
      }

      const { leading, trailing, userDefined } = getColumnNames(genomes);
      const leadingSystemColumnProps = getLeadingSystemColumnProps(leading);
      const trailingSystemColumnProps = getTrailingSystemColumnProps(trailing);
      const columnProps = [
        ...leadingSystemColumnProps,
        ...getUserDefinedColumnProps(userDefined),
        ...trailingSystemColumnProps,
      ];

      return {
        ...state,
        columnProps,
        publicMetadataColumnProps:
          publicMetadataColumnNames.length ?
            [ ...leadingSystemColumnProps,
              ...getUserDefinedColumnProps(publicMetadataColumnNames),
              ...trailingSystemColumnProps,
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
