import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Overlay from '../../components/overlay';
import DownloadButton from './DownloadButton.react';

import { setMenuActive } from '../../actions/downloads';
import { getActiveAssemblyIds } from '../selectors';
import { hasMetadata, hasTyping } from '../table/selectors';
import {
  createDownloadProps, formatCollectionFilename,
} from '../../constants/downloads';
import { getCounts, showCounts } from '../../utils/assembly';

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
  const { downloads, collection, entities, collectionViewer } = state;
  return {
    collection,
    assemblies: entities.assemblies,
    assemblyIds: getActiveAssemblyIds(state),
    ...downloads,
    collectionViewer, // needs to be here for selectors to work :/
    hasMetadata: hasMetadata(state),
    hasTyping: hasTyping(state),
  };
}

function mergeProps(state, { dispatch }) {
  const { assemblies, collection, assemblyIds, menuOpen, files } = state;
  return {
    menuOpen,
    counts: getCounts(assemblies, assemblyIds),
    files:
      Object.keys(files).
        filter(format => {
          const { hideFromMenu = () => false } = files[format];
          return !hideFromMenu(state);
        }).
        map(format => {
          const download = files[format];
          return createDownloadProps({
            format,
            download,
            id: assemblyIds,
            getFileName: () => `${formatCollectionFilename(collection)}`,
            getFileContents:
              download.getFileContents &&
                (() => download.getFileContents(state, dispatch)),
          }, dispatch);
        }),
    closeMenu() {
      dispatch(setMenuActive(false));
    },
  };
}

export default connect(mapStateToProps, null, mergeProps)(DownloadsMenu);
