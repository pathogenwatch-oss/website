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
    counts: React.PropTypes.object,
    closeMenu: React.PropTypes.func,
  },

  componentDidMount() {
    window.addEventListener('keydown', this.closeMenuOnEsc);
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeMenuOnEsc);
  },

  render() {
    const { menuOpen, files, counts = {} } = this.props;
    return (
      <div className={`wgsa-overlay ${menuOpen ? 'wgsa-overlay--is-visible' : ''}`.trim()}>
        <div className="wgsa-overlay__content wgsa-downloads-menu mdl-shadow--4dp" onClick={e => e.stopPropagation()}>
          <h3 className="mdl-dialog__title">Downloads</h3>
          { Object.keys(counts).length ?
            <p style={{margin: '24px 24px 0'}}>
              { counts.reference ? <strong>{counts.reference} Reference</strong> : null }
              { (counts.reference && counts.collection) ? (<span>,&nbsp;</span>) : null }
              { counts.collection ? (<strong style={{color: '#673c90'}}>{counts.collection} Collection</strong>) : null }
              { (counts.collection && counts.public) ? (<span>,&nbsp;</span>) : null }
              { counts.public ? `${counts.public} Public` : null }
            </p> : null
          }
          <div className="wgsa-downloads-menu__list">
            <ul className="wgsa-submenu">
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

  closeMenuOnEsc(event) {
    if (this.props.menuOpen && event.keyCode === 27) {
      this.props.closeMenu();
    }
  },

});

function mapStateToProps({ downloads, collection, filter, entities }) {
  return {
    assemblies: entities.assemblies,
    collectionId: collection.id,
    assemblyIds: [ ...(filter.active ? filter.ids : filter.unfilteredIds) ],
    ...downloads,
  };
}

function mergeProps(state, { dispatch }) {
  const { assemblies, collectionId, assemblyIds, menuOpen, files } = state;
  return {
    menuOpen,
    counts: assemblyIds.reduce((memo, id) => {
      const { __isReference, __isCollection } = assemblies[id];
      if (__isReference) {
        memo.reference++;
        return memo;
      }
      if (__isCollection) {
        memo.collection++;
        return memo;
      }
      memo.public++;
      return memo;
    }, { reference: 0, collection: 0, public: 0 }),
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
