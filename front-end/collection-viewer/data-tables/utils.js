import { getUserDefinedValue } from '../table/utils';

import * as table from '../table/constants';
import { systemDataColumns } from './constants';

export function getColumnNames(genomes) {
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
    if (genome.literatureLink) {
      trailing.add('__literatureLink');
    }
  });
  return { leading, userDefined, trailing };
}

export function getUserDefinedColumnProps(columnNames) {
  return Array.from(columnNames).map(column => ({
    columnKey: column,
    valueGetter(data) {
      return getUserDefinedValue(column, data);
    },
  }));
}

export function getLeadingSystemColumnProps(columnNames) {
  return [
    table.leftSpacerColumn,
    table.downloadColumnProps,
    table.nameColumnProps,
  ].concat(Array.from(columnNames).map(name => systemDataColumns[name]));
}

export function getTrailingSystemColumnProps(columnNames) {
  return (
    Array.from(columnNames).map(name => systemDataColumns[name]).
      concat([
        table.rightSpacerColumn,
      ])
  );
}

export let sources = {};

export function resetSources() {
  sources = {};
}
