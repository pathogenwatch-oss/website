import MetadataUtils from '../utils/Metadata';

export const systemDataColumns = {
  __date: {
    columnKey: '__date',
    valueGetter({ metadata }) {
      return MetadataUtils.getFormattedDateString(metadata.date);
    },
  },
  __subtype: {
    columnKey: '__subtype',
    valueGetter({ populationSubtype }) {
      return populationSubtype;
    },
  },
  __st: {
    columnKey: '__st',
    valueGetter({ analysis }) {
      return analysis.st;
    },
  },
  __profile: {
    columnKey: '__profile',
    valueGetter({ analysis }) {
      return analysis.mlst;
    },
  },
  '__ng-mast': {
    columnKey: '__ng-mast',
    valueGetter({ analysis }) {
      if (!analysis.ngmast) return null;
      return analysis.ngmast.ngmast;
    },
  },
  __por: {
    columnKey: '__por',
    valueGetter({ analysis }) {
      if (!analysis.ngmast) return null;
      return analysis.ngmast.por;
    },
  },
  __tbpb: {
    columnKey: '__tbpb',
    valueGetter({ analysis }) {
      if (!analysis.ngmast) return null;
      return analysis.ngmast.tbpb;
    },
  },
  __genotype: {
    columnKey: '__genotype',
    valueGetter({ analysis }) {
      if (!analysis.genotyphi) return null;
      return analysis.genotyphi.genotype;
    },
  },
  __core_matches: {
    columnKey: '__core_matches',
    valueGetter({ analysis }) {
      return analysis.core ?
        analysis.core.size :
        null;
    },
  },
  '__%_core_families': {
    columnKey: '__%_core_families',
    valueGetter({ analysis }) {
      return analysis.core ?
        analysis.core.percentMatched :
        null;
    },
  },
  '__%_non-core': {
    columnKey: '__%_non-core',
    valueGetter({ analysis }) {
      return analysis.core && analysis.core.percentAssemblyMatched ?
        (100 - analysis.core.percentAssemblyMatched).toFixed(1) :
        null;
    },
  },
  __assembly_length: {
    columnKey: '__assembly_length',
    valueGetter({ metadata }) {
      return metadata.metrics ?
        metadata.metrics.totalNumberOfNucleotidesInDnaStrings :
        null;
    },
  },
  __n50: {
    columnKey: '__n50',
    valueGetter({ metadata }) {
      return metadata.metrics ?
        metadata.metrics.contigN50 :
        null;
    },
  },
  '__no._contigs': {
    columnKey: '__no._contigs',
    valueGetter({ metadata }) {
      return metadata.metrics ?
        metadata.metrics.totalNumberOfContigs :
        null;
    },
  },
  '__non-ATCG': {
    columnKey: '__non-ATCG',
    valueGetter({ metadata }) {
      return metadata.metrics ?
        metadata.metrics.totalNumberOfNsInDnaStrings :
        null;
    },
  },
  __GC_Content: {
    columnKey: '__GC_Content',
    valueGetter({ metadata }) {
      return metadata.metrics && metadata.metrics.gcContent ?
        `${metadata.metrics.gcContent}%` :
        null;
    },
  },
};

function getSystemDataColumnKeys(uiOptions = {}) {
  return (
    [ '__date' ].
      concat(uiOptions.noPopulation ? [] : [ '__subtype', '__st' ]).
      concat(uiOptions.noMLST ? [] : [ '__profile' ]).
      concat(uiOptions.ngMast ? [ '__ng-mast', '__por', '__tbpb' ] : []).
      concat(uiOptions.genotyphi ? [ '__genotype' ] : []).
      concat([
        '__core_matches',
        '__%_core_families',
        '__%_non-core',
        '__assembly_length',
        '__n50',
        '__no._contigs',
        '__non-ATCG',
        '__GC_Content',
      ])
  );
}

export function getSystemDataColumnProps(uiOptions) {
  return getSystemDataColumnKeys(uiOptions).map(key => systemDataColumns[key]);
}

export const getUserDefinedValue =
  (column, { metadata }) => metadata.userDefined[column];
