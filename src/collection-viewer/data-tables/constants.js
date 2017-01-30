import React from 'react';

import { getFormattedDateString } from '../table/utils';

export const systemDataColumns = {
  __date: {
    columnKey: '__date',
    valueGetter({ date = {} }) {
      return getFormattedDateString(date);
    },
  },
  __pmid: {
    columnKey: '__pmid',
    valueGetter({ pmid }) {
      return pmid;
    },
    getCellContents({ valueGetter }, data) {
      const pmid = valueGetter(data);
      if (!pmid) return null;
      return (
        <a
          href={`http://www.ncbi.nlm.nih.gov/pubmed/${pmid}`}
          target="_blank" rel="noopener"
          title="View Publication"
          style={{ color: '#369' }}
          onClick={e => e.stopPropagation()}
        >
          {pmid}
        </a>
      );
    },
  },
  __wgsa_reference: {
    columnKey: '__wgsa_reference',
    valueGetter({ analysis }) {
      if (!analysis.fp) return null;
      return analysis.fp.subtype;
    },
  },
  __mlst: {
    columnKey: '__mlst',
    valueGetter({ analysis }) {
      if (!analysis.mlst) return null;
      return analysis.mlst.st;
    },
  },
  __mlst_profile: {
    columnKey: '__mlst_profile',
    valueGetter({ analysis }) {
      if (!analysis.mlst) return null;
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
  __genotyphi_snps: {
    columnKey: '__genotyphi_snps',
    valueGetter({ analysis }) {
      if (!analysis.genotyphi) return null;
      return analysis.genotyphi.snps;
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
  __genome_length: {
    columnKey: '__genome_length',
    valueGetter({ metrics }) {
      return metrics ?
        metrics.totalNumberOfNucleotidesInDnaStrings :
        null;
    },
  },
  __n50: {
    columnKey: '__n50',
    valueGetter({ metrics }) {
      return metrics ?
        metrics.contigN50 :
        null;
    },
  },
  '__no._contigs': {
    columnKey: '__no._contigs',
    valueGetter({ metrics }) {
      return metrics ?
        metrics.totalNumberOfContigs :
        null;
    },
  },
  '__non-ATCG': {
    columnKey: '__non-ATCG',
    valueGetter({ metrics }) {
      return metrics ?
        metrics.totalNumberOfNsInDnaStrings :
        null;
    },
  },
  __GC_Content: {
    columnKey: '__GC_Content',
    valueGetter({ metrics }) {
      return metrics && metrics.gcContent ?
        `${metrics.gcContent}%` :
        null;
    },
  },
};
