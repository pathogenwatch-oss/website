import React from 'react';

import DownloadButton from '../components/explorer/DownloadButton.react';

import MetadataUtils from '../utils/Metadata';

export const systemColumnProps = [
  { label: '',
    columnKey: '__download',
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
  { label: 'ASSEMBLY',
    columnKey: '__assembly',
    fixed: true,
    labelGetter({ metadata }) {
      return metadata.assemblyName;
    },
  },
  { label: 'DATE',
    columnKey: '__date',
    labelGetter({ metadata }) {
      return MetadataUtils.getFormattedDateString(metadata.date);
    },
  },
  { label: 'ST',
    columnKey: '__st',
    labelGetter({ analysis }) {
      return analysis.st;
    },
  },
  { label: 'MLST PROFILE',
    columnKey: '__mlst',
    labelGetter({ analysis }) {
      return analysis.mlst;
    },
  },
  { label: 'KERNEL SIZE',
    columnKey: '__kernel_size',
    labelGetter({ analysis }) {
      return analysis.kernelSize;
    },
  },
];
