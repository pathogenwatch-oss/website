import { createSelector } from 'reselect';

import { getGenomeList } from '../selectors';

import { getUserDefinedValue } from '../table/utils';

import * as table from '../table/constants';
import { systemDataColumns } from './constants';
import { getTableEntities } from '../table/selectors';


function getColumnNames(genomes) {
  const leading = new Set();
  const userDefined = new Set();
  const trailing = new Set();
  genomes.forEach(genome => {
    if (genome.userDefined) {
      Object.keys(genome.userDefined)
        .filter(name => name.length && !/__colou?r$/.test(name))
        .forEach(name => userDefined.add(name));
    }
    if (genome.year) {
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

export const getMetadataColumns = createSelector(
  state => (getGenomeList ? getGenomeList(state) : []),
  (genomes) => {
    const { leading, trailing, userDefined } = getColumnNames(genomes);
    const leadingSystemColumnProps = getLeadingSystemColumnProps(leading);
    const trailingSystemColumnProps = getTrailingSystemColumnProps(trailing);
    return [
      ...leadingSystemColumnProps,
      ...getUserDefinedColumnProps(userDefined),
      ...trailingSystemColumnProps,
    ];
  }
);

export const getActiveMetadataColumn = createSelector(
  getMetadataColumns,
  state => getTableEntities(state).metadata.activeColumn,
  (columns, activeColumn) => {
    for (const column of columns) {
      if (column.columnKey === activeColumn.columnKey) {
        return activeColumn;
      }
    }
    return table.nameColumnProps;
  }
);
