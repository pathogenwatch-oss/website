import React from 'react';

import { downloadColumnProps, nameColumnProps, getCellContents, }
  from '../constants/table';

import MetadataUtils from '../utils/Metadata';

export const systemColumnProps = [
  ...downloadColumnProps,
  nameColumnProps,
  { columnKey: '__date',
    valueGetter({ metadata }) {
      return MetadataUtils.getFormattedDateString(metadata.date);
    },
    getCellContents,
  },
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
  { columnKey: '__mlst_profile',
    valueGetter({ analysis }) {
      return analysis.mlst;
    },
    getCellContents,
  },
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
      return metadata.metrics ?
        `${metadata.metrics.gcContent}%` :
        null;
    },
    getCellContents,
  },
  { columnKey: '__pmid',
    valueGetter({ metadata }) {
      return metadata.pmid;
    },
    getCellContents({ valueGetter }, data) {
      const pmid = valueGetter(data);
      return (
        <a href={`http://www.ncbi.nlm.nih.gov/pubmed/${pmid}`}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
        >
          {pmid}
        </a>
      );
    },
  },
];
