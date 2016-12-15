import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from '../downloads/DownloadButton.react';

import { getCollection } from '../../collection-route/selectors';
import { getActiveAssemblies } from '../selectors';
import { getFiles } from '../downloads/selectors';

import { createDownloadProps, formatCollectionFilename } from '../downloads/utils';

import { sendJson } from '../../utils/Api';

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
    genomes: getActiveAssemblies(state),
    format: 'fasta_archive',
    collection: getCollection(state),
    download: getFiles(state).fasta_archive,
  };
}

function mergeProps({ genomes, format, download, collection }, { dispatch }) {
  return createDownloadProps({
    format,
    download,
    id: genomes,
    getFileName: () => formatCollectionFilename(collection),
    getFileContents: () =>
      sendJson('PUT', '/download/genome-archive', {
        type: 'collectionGenome',
        ids: genomes.map(_ => _.id),
      }),
  }, dispatch);
}

export default connect(mapStateToProps, null, mergeProps)(Button);
