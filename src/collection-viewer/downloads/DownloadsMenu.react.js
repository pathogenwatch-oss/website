import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Overlay from '../../components/overlay';
import DownloadButton from './DownloadButton.react';

import * as viewer from '../selectors';
import { getTables, hasMetadata, hasTyping } from '../table/selectors';

import { setMenuActive } from './actions';

import {
  createDownloadProps, formatCollectionFilename,
} from './utils';
import { getCounts, showCounts } from '../../utils/genome';

const DownloadsMenu = ({ menuOpen, files, counts = {}, closeMenu }) => (
  <Overlay isVisible={menuOpen} hide={closeMenu}>
    <div className="wgsa-downloads-menu">
      <h3 className="mdl-dialog__title">Downloads</h3>
      { Object.keys(counts).length ? showCounts(counts) : null }
      <div className="wgsa-downloads-menu__list">
        <ul className="wgsa-menu">
          { files.map(fileProps => (
              <li className="wgsa-menu__item" key={fileProps.format}>
                <DownloadButton {...fileProps} />
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  </Overlay>
);

DownloadsMenu.PropTypes = {
  menuOpen: React.PropTypes.bool,
  files: React.PropTypes.array,
  counts: React.PropTypes.object,
  closeMenu: React.PropTypes.func,
};

function mapStateToProps(state) {
  return {
    collection: viewer.getCollection(state),
    downloads: viewer.getViewer(state).downloads,
    genomes: viewer.getGenomes(state),
    genomeIds: viewer.getActiveGenomeIds(state),
    hasMetadata: hasMetadata(state),
    hasTyping: hasTyping(state),
    tables: getTables(state),
  };
}

const isCollection = collection => collection.idType === 'collection';

function mergeProps(state, { dispatch }) {
  const { genomes, collection, genomeIds, downloads } = state;
  const { menuOpen, files } = downloads;

  return {
    menuOpen,
    counts: getCounts(genomes, genomeIds),
    files:
      Object.keys(files).
        filter(format => {
          const { hideFromMenu = () => false } = files[format];
          return !hideFromMenu(state);
        }).
        map(format => {
          const download = files[format];
          return createDownloadProps({
            format, download,
            id: isCollection(download) ? collection.uuid : genomeIds,
            getFileName: () => `${formatCollectionFilename(collection)}`,
            getFileContents: download.getFileContents &&
              (() => download.getFileContents(state)),
          }, dispatch);
        }),
    closeMenu() {
      dispatch(setMenuActive(false));
    },
  };
}

export default connect(mapStateToProps, null, mergeProps)(DownloadsMenu);
