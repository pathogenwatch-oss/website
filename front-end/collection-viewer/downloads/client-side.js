import { createCSV } from './CsvWorker';

import { getColumnLabel } from '../table/utils';
import { tableKeys } from '../constants';

function getUniqueValueColumns(memo, column) {
  if (column.group) return column.columns.reduce(getUniqueValueColumns, memo);
  if (column.columnKey in memo || column.hidden || !column.valueGetter) {
    return memo;
  }
  memo[column.columnKey] = column;
  return memo;
}

function convertTableToCSV(table, additionalColumns = []) {
  return function ({ genomes, genomeIds, tables }) {
    let columns = tables[table].columns.reduce(getUniqueValueColumns, {});
    columns =
      Object.keys(columns)
        .map(key => ({
          key,
          label: columns[key].displayName || getColumnLabel(columns[key]),
        }))
        .concat(additionalColumns);
    const rows = genomeIds.map(id => genomes[id]);
    return Promise.resolve(createCSV(table, columns, rows));
  };
}

export const generateMetadataFile = convertTableToCSV(
  tableKeys.metadata, [
    { key: '__latitude', label: 'LATITUDE' },
    { key: '__longitude', label: 'LONGITUDE' },
  ]
);
export const generateTypingFile = convertTableToCSV(tableKeys.typing);
export const generateStatsFile = convertTableToCSV(tableKeys.stats);
export const generateAMRProfile = convertTableToCSV(tableKeys.antibiotics);
export const generateAMRSNPs = convertTableToCSV(tableKeys.snps);
export const generateAMRGenes = convertTableToCSV(tableKeys.genes);
export const generateKleborateAMRProfiles = convertTableToCSV(tableKeys.kleborateAMR);
export const generateKleborateAMRGenotypes = convertTableToCSV(tableKeys.kleborateAMRGenotypes);
export const generateSarscov2Variants = convertTableToCSV(tableKeys.sarscov2Variants);
export const generateVistaFile = convertTableToCSV(tableKeys.vista);
