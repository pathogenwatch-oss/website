// import React from 'react';

import { downloadColumnProps, nameColumnProps, getCellContents }
  from '../constants/table';

import MetadataUtils from '../utils/Metadata';

export function getSystemColumnProps({ noPopulation, noMLST } = {}) {
  return [
    ...downloadColumnProps,
    nameColumnProps,
    { columnKey: '__date',
      valueGetter({ metadata }) {
        return MetadataUtils.getFormattedDateString(metadata.date);
      },
      getCellContents,
    },
  ].
  concat(noPopulation ? [] : [
    { columnKey: '__subtype',
      valueGetter({ populationSubtype }) {
        return populationSubtype;
      },
      getCellContents,
    },
    { columnKey: '__st',
      valueGetter({ analysis }) {
        return analysis.st;
      },
      getCellContents,
    },
  ]).
  concat(noMLST ? [] : [
    { columnKey: '__mlst_profile',
      valueGetter({ analysis }) {
        return analysis.mlst;
      },
      getCellContents,
    },
  ]).
  concat([
    { columnKey: '__core_matches',
      valueGetter({ analysis }) {
        return analysis.core ?
          analysis.core.size :
          null;
      },
      getCellContents,
    },
    { columnKey: '__%_core_families',
      valueGetter({ analysis }) {
        return analysis.core ?
          analysis.core.percentMatched :
          null;
      },
      getCellContents,
    },
    { columnKey: '__%_non-core',
      valueGetter({ analysis }) {
        return analysis.core && analysis.core.percentAssemblyMatched ?
          (100 - analysis.core.percentAssemblyMatched).toFixed(1) :
          null;
      },
      getCellContents,
    },
    { columnKey: '__assembly_length',
      valueGetter({ metadata }) {
        return metadata.metrics ?
          metadata.metrics.totalNumberOfNucleotidesInDnaStrings :
          null;
      },
      getCellContents,
    },
    { columnKey: '__n50',
      valueGetter({ metadata }) {
        return metadata.metrics ?
          metadata.metrics.contigN50 :
          null;
      },
      getCellContents,
    },
    { columnKey: '__no._contigs',
      valueGetter({ metadata }) {
        return metadata.metrics ?
          metadata.metrics.totalNumberOfContigs :
          null;
      },
      getCellContents,
    },
    { columnKey: '__non-ATCG',
      valueGetter({ metadata }) {
        return metadata.metrics ?
          metadata.metrics.totalNumberOfNsInDnaStrings :
          null;
      },
      getCellContents,
    },
    { columnKey: '__GC_Content',
      valueGetter({ metadata }) {
        return metadata.metrics && metadata.metrics.gcContent ?
          `${metadata.metrics.gcContent}%` :
          null;
      },
      getCellContents,
    },
  ]);
}
