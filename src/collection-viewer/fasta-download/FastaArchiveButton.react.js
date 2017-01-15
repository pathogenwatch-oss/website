import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from '../downloads/DownloadButton.react';

import { getCollection } from '../../collection-route/selectors';
import { getActiveGenomes } from '../selectors';
import { getFiles } from '../downloads/selectors';

import { createDownloadProps, formatCollectionFilename } from '../downloads/utils';

import { fetchJson } from '../../utils/Api';

const Button = props => (
  <DownloadButton
    {...props}
    description="All Genomes"
    isArchive
    iconOnly
  />
);

function mapStateToProps(state) {
  return {
    genomes: getActiveGenomes(state),
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
      fetchJson('PUT', '/download/genome-archive', {
        type: 'collectionGenome',
        ids: genomes.map(_ => _.id),
      }),
  }, dispatch);
}

export default connect(mapStateToProps, null, mergeProps)(Button);
