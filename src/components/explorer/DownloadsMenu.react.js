import '^/css/overlay.css';
import '^/css/downloads-menu.css';

import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from './DownloadButton.react';

import { setMenuActive } from '^/actions/downloads';

import { createDownloadProps, formatCollectionFilename } from '^/constants/downloads';
import { getCounts, showCounts } from '^/utils/assembly';

const DownloadsMenu = React.createClass({

  propTypes: {
    menuOpen: React.PropTypes.bool,
    files: React.PropTypes.array,
    counts: React.PropTypes.object,
    closeMenu: React.PropTypes.func,
  },

  componentDidMount() {
    window.addEventListener('keydown', this.closeMenuOnEsc);
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeMenuOnEsc);
  },

  closeMenuOnEsc(event) {
    if (this.props.menuOpen && event.keyCode === 27) {
      this.props.closeMenu();
    }
  },

  render() {
    const { menuOpen, files, counts = {} } = this.props;
    return (
      <div className={`wgsa-overlay ${menuOpen ? 'wgsa-overlay--is-visible' : ''}`.trim()}>
        <div className="wgsa-overlay__content wgsa-downloads-menu mdl-shadow--4dp" onClick={e => e.stopPropagation()}>
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
      </div>
    );
  },

});

function mapStateToProps({ downloads, collection, filter, entities, tables }) {
  return {
    collection,
    assemblies: entities.assemblies,
    assemblyIds: [ ...(filter.active ? filter.ids : filter.unfilteredIds) ],
    ...downloads,
    tables,
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
