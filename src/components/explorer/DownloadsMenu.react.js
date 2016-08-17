import '^/css/overlay.css';
import '^/css/downloads-menu.css';

import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from './DownloadButton.react';

import { setMenuActive, requestDownload } from '^/actions/downloads';

import { createDownloadKey, createFilename } from '^/constants/downloads';

import { getCounts, showCounts } from '^/utils/assembly';
import { requestFile } from '^/utils/Api';

import Species from '^/species';


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
    assemblies: entities.assemblies,
    collectionId: collection.id,
    assemblyIds: [ ...(filter.active ? filter.ids : filter.unfilteredIds) ],
    ...downloads,
    tables,
  };
}

function mergeProps(state, { dispatch }) {
  const { assemblies, collectionId, assemblyIds, menuOpen, files } = state;
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
          const {
            linksById, filename, getFileContents, ...props,
          } = files[format];

          const idList = assemblyIds;
          const linkProps =
            linksById ? linksById[createDownloadKey(idList)] : {};

          return {
            format,
            ...props,
            ...linkProps,
            onClick: () => dispatch(requestDownload({
              format,
              idList,
              filename: createFilename(filename, collectionId),
              getFileContents() {
                return getFileContents ?
                  getFileContents(state) :
                  requestFile(
                    { speciesId: Species.id, format }, { idList }
                  );
              },
            })),
          };
        }),
    closeMenu() {
      dispatch(setMenuActive(false));
    },
  };
}

export default connect(mapStateToProps, null, mergeProps)(DownloadsMenu);
