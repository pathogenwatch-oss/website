import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Overlay from '../../components/overlay';
import DownloadButton from './DownloadButton.react';

import { getCollection, getAssemblies, getViewer } from '../../collection-route/selectors';
import { getTables } from '../table/selectors';
import { getActiveAssemblyIds } from '../selectors';

import { setMenuActive } from './actions';

import {
  createDownloadProps, formatCollectionFilename,
} from './utils';
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
  const viewer = getViewer(state);
  return {
    collection: getCollection(state),
    assemblies: getAssemblies(state),
    assemblyIds: getActiveAssemblyIds(state),
    ...viewer.downloads,
    tables: getTables(state),
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
          return !hideFromMenu();
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
