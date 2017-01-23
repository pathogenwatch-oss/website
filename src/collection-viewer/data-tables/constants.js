import React from 'react';

import { getFormattedDateString } from '../table/utils';

export const systemDataColumns = {
  __date: {
    columnKey: '__date',
    valueGetter({ metadata }) {
      return getFormattedDateString(metadata.date);
    },
  },
  __pmid: {
    columnKey: '__pmid',
    valueGetter({ metadata }) {
      return metadata.pmid;
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
      return analysis.populationSubtype;
    },
  },
  __mlst: {
    columnKey: '__mlst',
    valueGetter({ analysis }) {
      return analysis.st;
    },
  },
  __mlst_profile: {
    columnKey: '__mlst_profile',
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
