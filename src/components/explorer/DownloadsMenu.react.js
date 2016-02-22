import '^/css/overlay.css';
import '^/css/downloads-menu.css';

import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from './DownloadButton.react';

import { setMenuActive, requestDownload } from '^/actions/downloads';

import { createDownloadKey, createFilename } from '^/constants/downloads';

const DownloadsMenu = React.createClass({

  propTypes: {
    menuOpen: React.PropTypes.bool,
    files: React.PropTypes.array,
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
              { files.filter(_ => !_.ignoresFilter).map(fileProps => (
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
              { files.filter(_ => _.ignoresFilter).map(fileProps => (
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
    assemblyIds: [ ...(filter.active ? filter.ids : filter.unfilteredIds) ],
    ...downloads,
  };
}

function mergeProps(state, { dispatch }) {
  const { collectionId, assemblyIds, menuOpen, files } = state;
  return {
    menuOpen,
    files:
      Object.keys(files).
        filter(format => !files[format].notMenu).
        map(format => {
          const { ignoresFilter, linksById, filename, ...props } = files[format];
          const idList = ignoresFilter ? [ collectionId ] : assemblyIds;
          const linkProps = linksById ? linksById[createDownloadKey(idList)] : {};
          return {
            format,
            ...props,
            ...linkProps,
            ignoresFilter,
            onClick: () => dispatch(
              requestDownload({
                format,
                ignoresFilter,
                idList,
                filename: createFilename(filename, collectionId),
              })
            ),
          };
        }),
    closeMenu() {
      dispatch(setMenuActive(false));
    },
  };
}

export default connect(mapStateToProps, null, mergeProps)(DownloadsMenu);
