import '../../css/dropdown-menu.css';

import React from 'react';
import { connect } from 'react-redux';

import DownloadMenuItem from './DownloadsMenuItem.react';

import { setMenuActive, requestDownload } from '^/actions/downloads';

import { createDownloadKey } from '^/constants/downloads';

const DownloadsMenu = ({
  menuOpen,
  files,
  menuButtonOnClick,
}) => (
  <div className={`wgsa-menu ${menuOpen ? 'wgsa-menu--is-open' : ''}`} onClick={e => e.stopPropagation()}>
    <button className="wgsa-menu-button mdl-button" onClick={menuButtonOnClick}>
      <i className="wgsa-button-icon material-icons">file_download</i>
      <span>Downloads</span>
    </button>
    <ul className="wgsa-menu__list mdl-shadow--2dp">
      <li>
        <ul className="wgsa-submenu">
          { (files).map(({ format, ...props }) => (
              <DownloadMenuItem key={format} format={format} {...props} />
            )
          )}
        </ul>
      </li>
    </ul>
  </div>
);

DownloadsMenu.propTypes = {
  populationTreeLink: React.PropTypes.string,
  collectionTreeLink: React.PropTypes.string,
  collectionId: React.PropTypes.string,
  active: React.PropTypes.bool,
  dispatch: React.PropTypes.func,
};

function mapStateToProps({ downloads, collection, filter }) {
  return {
    collectionId: collection.id,
    assemblyIds: [ ...(filter.active ?  filter.ids : filter.unfilteredIds) ],
    ...downloads,
  };
}

function mergeProps(state, { dispatch }) {
  const { collectionId, assemblyIds, menuOpen, files } = state;
  return {
    menuOpen,
    menuButtonOnClick: () => dispatch(setMenuActive(!menuOpen)),
    files: Object.keys(files).map(format => {
      const { collection, linksById, ...props } = files[format];
      const ids = collection ? [ collectionId ] : assemblyIds;
      const linkProps = linksById ? linksById[createDownloadKey(ids)] : {};
      return {
        format,
        ...props,
        ...linkProps,
        onClick: () => dispatch(requestDownload(format, collection, ids)),
      };
    }),
  };
}

export default connect(mapStateToProps, null, mergeProps)(DownloadsMenu);
