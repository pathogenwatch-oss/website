import React from 'react';

import MetadataUtils from '../utils/Metadata';

export const getCellContents = ({ valueGetter },  data) => valueGetter(data);

export const systemColumnProps = [
  { columnKey: '__assembly',
    fixed: true,
    selected: true,
    valueGetter({ metadata }) {
      return metadata.assemblyName;
    },
    getCellContents,
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
  { columnKey: '__kernel_size',
    valueGetter({ analysis }) {
      return analysis.kernelSize;
    },
    getCellContents,
  },
  { columnKey: '__assembly_length',
    valueGetter({ metadata }) {
      return metadata.metrics.totalNumberOfNucleotidesInDnaStrings;
    },
    getCellContents,
  },
  { columnKey: '__n50',
    valueGetter({ metadata }) {
      return metadata.metrics.contigN50;
    },
    getCellContents,
  },
  { columnKey: '__no._contigs',
    valueGetter({ metadata }) {
      return metadata.metrics.totalNumberOfContigs;
    },
    getCellContents,
  },
  { columnKey: '__n_count',
    valueGetter({ metadata }) {
      return metadata.metrics.totalNumberOfNsInDnaStrings;
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
