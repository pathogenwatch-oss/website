import React from 'react';

import DownloadButton from '../components/explorer/DownloadButton.react';

import MetadataUtils from '../utils/Metadata';

export const getCellContents = ({ labelGetter },  data) => labelGetter(data);

export const systemColumnProps = [
  { columnKey: '__download',
    width: 50,
    flexGrow: 0,
    fixed: true,
    noHeader: true,
    getCellContents(data) {
      return (
        <DownloadButton
          id={data.assemblyId}
          format={'fasta'}
          description={'Assembly Fasta'} />
      );
    },
  },
  { columnKey: '__assembly',
    fixed: true,
    selected: true,
    labelGetter({ metadata }) {
      return metadata.assemblyName;
    },
    getCellContents,
  },
  { columnKey: '__date',
    labelGetter({ metadata }) {
      return MetadataUtils.getFormattedDateString(metadata.date);
    },
    getCellContents,
  },
  { columnKey: '__st',
    labelGetter({ analysis }) {
      return analysis.st;
    },
    getCellContents,
  },
  { columnKey: '__mlst',
    labelGetter({ analysis }) {
      return analysis.mlst;
    },
    getCellContents,
  },
  { columnKey: '__kernel_size',
    labelGetter({ analysis }) {
      return analysis.kernelSize;
    },
    getCellContents,
  },
];
