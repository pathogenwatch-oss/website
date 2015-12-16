import React from 'react';

import { nameColumnProps, getCellContents } from '../constants/table';
import MetadataUtils from '../utils/Metadata';

export const systemColumnProps = [
  { ...nameColumnProps,
    selected: true,
  },
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
      return analysis.kernelSize;
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
  { columnKey: '__n_count',
    valueGetter({ metadata }) {
      return metadata.metrics ?
        metadata.metrics.totalNumberOfNsInDnaStrings :
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
