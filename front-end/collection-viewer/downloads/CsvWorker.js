import Papa from 'papaparse';

import { getUserDefinedValue } from '../table/utils';

import { systemDataColumns } from '../data-tables/constants';
import { createCode } from '../../mlst/utils';

import { hasElement, isResistant, kleborateHasElement, kleborateIsResistant } from '../amr-utils';
import { findCluster, hasCluster } from '~/collection-viewer/amr-tables/vista';

const nameColumn = {
  columnKey: '__name',
  valueGetter({ name }) {
    return name;
  },
};

const latitudeColumn = {
  columnKey: '__latitude',
  valueGetter({ position }) {
    return position && position.latitude ? position.latitude : '';
  },
};

const longitudeColumn = {
  columnKey: '__longitude',
  valueGetter({ position }) {
    return position && position.longitude ? position.longitude : '';
  },
};

const mlstColumn = {
  columnKey: '__mlst',
  valueGetter({ analysis }) {
    if (!analysis.mlst) return '';
    return analysis.mlst.st;
  },
};

const mlstProfileColumn = {
  columnKey: '__mlst_profile',
  valueGetter({ analysis }) {
    if (!analysis.mlst) return null;
    const { code, alleles } = analysis.mlst;
    if (code) return code;
    return createCode(alleles);
  },
};

const definedColumns = {
  [nameColumn.columnKey]: nameColumn,
  [latitudeColumn.columnKey]: latitudeColumn,
  [longitudeColumn.columnKey]: longitudeColumn,
  ...systemDataColumns,
  [mlstColumn.columnKey]: mlstColumn,
  [mlstProfileColumn.columnKey]: mlstProfileColumn,
};

const valueGettersByTable = {
  metadata: getUserDefinedValue,
  typing: getUserDefinedValue,
  stats: getUserDefinedValue,
  antibiotics: (antibiotic, { analysis: { paarsnp } }) =>
    (!!paarsnp && isResistant(paarsnp, antibiotic) ? 1 : 0),
  snps: (snp, genome) => (hasElement(genome, 'variants', snp) ? 1 : 0),
  genes: (gene, genome) => (hasElement(genome, 'acquired', gene) ? 1 : 0),
  kleborateAMR: (antibiotic, { analysis: { kleborate } }) =>
    (kleborateIsResistant(kleborate, antibiotic.replace('kleborate_', '')) ? 1 : 0),
  kleborateAMRGenotypes: (element, { analysis: { kleborate } }) =>
    (kleborateHasElement(kleborate, element.replace('kleborateAMRGenotypes_', '').split('_')[0], element.replace('kleborateAMRGenotypes_', '').split('_').slice(1).join('_')) ? 1 : 0),
  sarscov2Variants: (element, { analysis }) =>
    (mapSarscov2VariantState(element, analysis)),
  vista: (element, { analysis }) => (mapVistaState(element.replace('vista_', ''), analysis)),
};

function mapVistaState(element, { vista }) {
  const geneRecord = findCluster(element, vista.virulenceGenes);
  if (!!geneRecord) {
    return geneRecord.status;
  } else {
    return findCluster(element, vista.virulenceClusters).status;
  }
}

function mapSarscov2VariantState(element, analysis) {
  const variant = analysis['sarscov2-variants'].variants.find(variant => variant.name === element);
  return variant.state === 'other' ? `${variant.state} (${variant.found})` : variant.state;
}

function mapToGetters(columns, table) {
  return columns.map(({ key }) => {
    if (key in definedColumns) {
      return definedColumns[key].valueGetter;
    }
    const valueGetter = valueGettersByTable[table];
    return row => valueGetter(key, row);
  });
}

export function createCSV(table, columns, rows) {
  const valueGetters = mapToGetters(columns, table);
  return Papa.unparse({
    fields: columns.map(_ => _.label),
    data: rows.map(row => valueGetters.map(getter => getter(row))),
  });
}
