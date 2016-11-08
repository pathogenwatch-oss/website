import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from '../collection-viewer/downloads/DownloadButton.react';

import { createDownloadProps, formatCollectionFilename } from '../constants/downloads';
import { getFastaArchiveFiles } from './selectors';

import { postJson } from '../utils/Api';

const Button = props => (
  <DownloadButton
    {...props}
    description="All Assemblies"
    isArchive
    iconOnly
  />
);

function mapStateToProps(state) {
  const { collection, downloads } = state;
  return {
    files: getFastaArchiveFiles(state),
    format: 'fasta_archive',
    collection,
    download: downloads.files.fasta_archive,
  };
}

function mergeProps({ files, format, download, collection }, { dispatch }) {
  return createDownloadProps({
    format,
    download,
    id: files,
    getFileName: () => formatCollectionFilename(collection),
    getFileContents: () => postJson('/download/fastas', { files }),
  }, dispatch);
}

export default connect(mapStateToProps, null, mergeProps)(Button);
