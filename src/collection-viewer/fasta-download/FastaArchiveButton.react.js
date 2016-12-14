import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from '../downloads/DownloadButton.react';

import { getCollection } from '../../collection-route/selectors';
import { getFastaArchiveFiles } from './selectors';
import { getFiles } from '../downloads/selectors';

import { createDownloadProps, formatCollectionFilename } from '../downloads/utils';

import { postJson } from '../../utils/Api';

const Button = props => (
  <DownloadButton
    {...props}
    description="All Assemblies"
    isArchive
    iconOnly
  />
);

function mapStateToProps(state) {
  return {
    files: getFastaArchiveFiles(state),
    format: 'fasta_archive',
    collection: getCollection(state),
    download: getFiles(state).fasta_archive,
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
