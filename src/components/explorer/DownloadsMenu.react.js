import '^/css/overlay.css';
import '^/css/downloads-menu.css';

import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from './DownloadButton.react';

import { setMenuActive, requestDownload } from '^/actions/downloads';

import { createDownloadKey } from '^/constants/downloads';

const DownloadsMenu = React.createClass({

  propTypes: {
    menuOpen: React.PropTypes.bool,
    files: React.PropTypes.object,
    closeMenu: React.PropTypes.func,
  },

  componentDidMount() {
    window.addEventListener('keydown', this.closeMenuOnEsc);
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeMenuOnEsc);
  },

  render() {
    const { menuOpen, files } = this.props;
    return (
      <div className={`wgsa-overlay ${menuOpen ? 'wgsa-overlay--is-visible' : ''}`.trim()}>
        <div className="wgsa-overlay__content wgsa-downloads-menu mdl-shadow--3dp" onClick={e => e.stopPropagation()}>
          <h3 className="mdl-dialog__title">Downloads</h3>
          <div className="wgsa-downloads-menu__list">
            <h4 className="wgsa-menu-heading">Filtered</h4>
            <ul className="wgsa-submenu">
              { (files).filter(_ => !_.collection).map(fileProps => (
                  <li className="wgsa-menu__item" key={fileProps.format}>
                    <DownloadButton {...fileProps} />
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="wgsa-downloads-menu__list">
            <h4 className="wgsa-menu-heading">Unfiltered</h4>
            <ul className="wgsa-submenu">
              { (files).filter(_ => _.collection).map(fileProps => (
                  <li className="wgsa-menu__item" key={fileProps.format}>
                    <DownloadButton {...fileProps} />
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  },

  closeMenuOnEsc(event) {
    if (this.props.menuOpen && event.keyCode === 27) {
      this.props.closeMenu();
    }
  },

});

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
    files:
      Object.keys(files).
        filter(format => !files[format].assembly).
        map(format => {
          const { collection, linksById, ...props } = files[format];
          const ids = collection ? [ collectionId ] : assemblyIds;
          const linkProps = linksById ? linksById[createDownloadKey(ids)] : {};
          return {
            format,
            ...props,
            ...linkProps,
            collection,
            onClick: () => dispatch(requestDownload(format, collection, ids)),
          };
        }),
    closeMenu() {
      dispatch(setMenuActive(false));
    },
  };
}

export default connect(mapStateToProps, null, mergeProps)(DownloadsMenu);
