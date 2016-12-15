import { getFormattedDateString } from '../../utils/Date';

export const systemDataColumns = {
  __date: {
    columnKey: '__date',
    valueGetter({ date }) {
      return date ? getFormattedDateString(date) : '';
    },
  },
  __wgsa_reference: {
    columnKey: '__wgsa_reference',
    valueGetter({ analysis }) {
      return analysis.fp ? analysis.fp.subtype : '';
    },
  },
  __st: {
    columnKey: '__st',
    valueGetter({ analysis }) {
      return analysis.mlst.st;
    },
  },
  __profile: {
    columnKey: '__profile',
    valueGetter({ analysis }) {
      return analysis.mlst.code;
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
  __genotyphi_type: {
    columnKey: '__genotyphi_type',
    valueGetter({ analysis }) {
      if (!analysis.genotyphi) return null;
      return analysis.genotyphi.genotype;
    },
  },
  __core_matches: {
    columnKey: '__core_matches',
    valueGetter({ analysis }) {
      return analysis.core ? analysis.core.size : null;
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
    valueGetter({ metrics }) {
      return metrics ? metrics.totalNumberOfNucleotidesInDnaStrings : null;
    },
  },
  __n50: {
    columnKey: '__n50',
    valueGetter({ metrics }) {
      return metrics ? metrics.contigN50 : null;
    },
  },
  '__no._contigs': {
    columnKey: '__no._contigs',
    valueGetter({ metrics }) {
      return metrics ? metrics.totalNumberOfContigs : null;
    },
  },
  '__non-ATCG': {
    columnKey: '__non-ATCG',
    valueGetter({ metrics }) {
      return metrics ? metrics.totalNumberOfNsInDnaStrings : null;
    },
  },
  __GC_Content: {
    columnKey: '__GC_Content',
    valueGetter({ metrics }) {
      return metrics && metrics.gcContent ? `${metrics.gcContent}%` : null;
    },
  },
};
