import React from 'react';
import { connect } from 'react-redux';

import Overlay from '../../components/overlay';

import { getDownloadPrefix, isMenuOpen, getCounts } from './selectors';
import { getActiveGenomeIds, getCollection, getFilter } from '../selectors';
import { hasMetadata, hasTyping } from '../table/selectors';

import { setMenuActive } from './actions';

import { formatCollectionFilename } from './utils';
import { showCounts } from '../../utils/genome';

const DownloadForm = ({ link, filename, title, genomeIds, children }) => (
  <form
    action={`${link}?filename=${filename}`}
    method="POST"
    className="wgsa-download-button"
  >
    <button
      type="submit"
      download={filename}
      title={title}
      className="wgsa-download-button"
    >
      {children}
    </button>
    { genomeIds && <input type="hidden" name="ids" value={genomeIds} /> }
  </form>
);

const DownloadButton = ({ link, filename, title, children }) => (
  <a
    href={`${link}?filename=${filename}`}
    target="_blank" rel="noopener"
    download={filename}
    title={title}
    className="wgsa-download-button"
  >
    {children}
  </a>
);

const DownloadsMenu = ({ menuOpen, prefix, collection, counts = {}, closeMenu, genomeIds, filterActive }) => (
  <Overlay isVisible={menuOpen} hide={closeMenu}>
    <div className="wgsa-downloads-menu">
      <h3 className="mdl-dialog__title">Downloads</h3>
      { Object.keys(counts).length ? showCounts(counts) : null }
      <div className="wgsa-downloads-menu__list">
        <ul className="wgsa-menu">
          <li className="wgsa-menu__item">
            <DownloadForm
              link={`${prefix}/core-allele-distribution`}
              filename={formatCollectionFilename(collection, 'core-allele-distribution.csv')}
              genomeIds={filterActive ? genomeIds : null}
            >Core Allele Distribution</DownloadForm>
          </li>
          <li className="wgsa-menu__item">
            <DownloadButton
              link={`${prefix}/variance-summary`}
              filename={formatCollectionFilename(collection, 'variance-summary.csv')}
            >
              Variance Summary
            </DownloadButton>
          </li>
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
  filterActive: React.PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    prefix: getDownloadPrefix(state),
    menuOpen: isMenuOpen(state),
    collection: getCollection(state),
    counts: getCounts(state),
    genomeIds: getActiveGenomeIds(state),
    hasMetadata: hasMetadata(state),
    hasTyping: hasTyping(state),
    filterActive: getFilter(state).active,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeMenu: () => dispatch(setMenuActive(false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsMenu);
