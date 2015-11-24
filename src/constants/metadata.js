import React from 'react';

import DownloadButton from '../components/explorer/DownloadButton.react';

import MetadataUtils from '../utils/Metadata';

export const getCellContents = ({ valueGetter },  data) => valueGetter(data);

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
  { columnKey: '__st',
    valueGetter({ analysis }) {
      return analysis.st;
    },
    getCellContents,
  },
  { columnKey: '__mlst',
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
];
