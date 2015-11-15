import React from 'react';

import DownloadButton from '../components/explorer/DownloadButton.react';

import MetadataUtils from '../utils/Metadata';

export const systemColumnProps = [
  { label: '',
    dataKey: '__download',
    width: 50,
    flexGrow: 0,
    fixed: true,
    cellRenderer(_, __, data) {
      return (
        <DownloadButton
          id={data.assemblyId}
          format={'fasta'}
          description={'Assembly Fasta'} />
      );
    },
  },
  { label: 'ASSEMBLY',
    dataKey: '__assembly',
    fixed: true,
    labelGetter({ metadata }) {
      return metadata.assemblyName;
    },
  },
  { label: 'DATE',
    dataKey: '__date',
    labelGetter({ metadata }) {
      return MetadataUtils.getFormattedDateString(metadata.date);
    },
  },
  { label: 'ST',
    dataKey: '__st',
    labelGetter({ analysis }) {
      return analysis.st;
    },
  },
  { label: 'MLST PROFILE',
    dataKey: '__mlst',
    labelGetter({ analysis }) {
      return analysis.mlst;
    },
  },
  { label: 'KERNEL SIZE',
    dataKey: '__kernel_size',
    labelGetter({ analysis }) {
      return analysis.kernelSize;
    },
  },
];
