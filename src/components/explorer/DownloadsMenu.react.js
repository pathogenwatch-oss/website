import '../../css/dropdown-menu.css';

import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from './DownloadButton.react';

import { setMenuActive } from '^/actions/download';

import Species from '^/species';

const DownloadsMenu = ({
  populationTreeLink,
  collectionTreeLink,
  collectionId,
  active,
  dispatch,
}) => (
  <div className={`wgsa-menu ${active ? 'wgsa-menu--is-open' : ''}`} onClick={e => e.stopPropagation()}>
    <button className="wgsa-menu-button mdl-button" onClick={() => dispatch(setMenuActive(!active))}>
      <i className="wgsa-button-icon material-icons">file_download</i>
      <span>Downloads</span>
    </button>
    <ul className="wgsa-menu__list mdl-shadow--2dp">
      <li>
        <span className="wgsa-menu-heading">Population Downloads</span>
        <ul className="wgsa-submenu">
          <li className="wgsa-menu__item">
            <a href={populationTreeLink}
              target="_blank"
              download={`${Species.nickname}_population_tree.nwk`}
              title="Download Population Tree (.nwk)">
                <span className="wgsa-download-button mdl-button mdl-button--icon">
                  <i className="wgsa-button-icon material-icons">file_download</i>
                </span>
                Population Tree (.nwk)
            </a>
          </li>
        </ul>
      </li>
      <li>
        <span className="wgsa-menu-heading">Collection Downloads</span>
        <ul className="wgsa-submenu">
          <li className="wgsa-menu__item">
            <a href={collectionTreeLink}
              target="_blank"
              download={`${collectionId}_collection_tree.nwk`}
              title="Download Collection Tree (.nwk)">
                <span className="wgsa-download-button mdl-button mdl-button--icon">
                  <i className="wgsa-button-icon material-icons">file_download</i>
                </span>
                Collection Tree (.nwk)
            </a>
          </li>
          <li className="wgsa-menu__item">
            <DownloadButton
              description="Kernel Checksum Distribution"
              format="kernel_checksum_distribution" />
            Kernel Checksum Distribution
          </li>
          <li className="wgsa-menu__item">
            <DownloadButton
              description="Concatenated Gene Family"
              format="extended_kernel_fasta" />
            Kernel Matches
          </li>
          <li className="wgsa-menu__item">
            <DownloadButton
              description="Kernel Sequence Fasta"
              format="kernel_fasta" />
            Kernel Sequence (.fa)
          </li>
          <li className="wgsa-menu__item">
            <DownloadButton
              description="Kernel CSV"
              format="kernel_csv" />
            Kernel Sequence (.csv)
          </li>
          <li className="wgsa-menu__item">
            <DownloadButton
              description="Concatenated Gene Family"
              format="score_matrix" />
            Score Matrix
          </li>
          <li className="wgsa-menu__item">
            <DownloadButton
              description="Concatenated Gene Family"
              format="differences_matrix" />
            Differences Matrix
          </li>
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

function mapStateToProps({ ui, collectionId }) {
  return {
    collectionId: collectionId,
    populationTreeLink: ui.treeLinks.population,
    collectionTreeLink: ui.treeLinks.collection,
    active: ui.downloadsMenu.active,
  };
}

export default connect(mapStateToProps)(DownloadsMenu);
