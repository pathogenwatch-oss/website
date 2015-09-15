import '../css/dropdown-menu.css';

import React from 'react';

import DownloadButton from './DownloadButton.react';

import UploadedCollectionStore from '../stores/UploadedCollectionStore';
import ReferenceCollectionStore from '../stores/ReferenceCollectionStore';
import BodyClickStore from '../stores/BodyClickStore';

import Species from '../species';

const windowURL = window.URL || window.webkitURL;
function createBlobUrl(data, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([ data ], { type });
  return windowURL.createObjectURL(blob);
}

export default React.createClass({

  propTypes: {
    active: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      active: false,
    };
  },

  componentWillMount() {
    this.collectionId = UploadedCollectionStore.getCollectionId();
    this.populationTreeLink = createBlobUrl(ReferenceCollectionStore.getTree());
    this.collectionTreeLink = createBlobUrl(UploadedCollectionStore.getUserTree());
  },

  componentDidMount() {
    BodyClickStore.addChangeListener(this.handleBodyClickStoreChange);
  },

  componentWillUnmount() {
    BodyClickStore.removeChangeListener(this.handleBodyClickStoreChange);
  },

  render() {
    return (
      <div className={`wgsa-menu ${this.state.active ? 'wgsa-menu--is-open' : ''}`}>
        <button ref="button" className="wgsa-menu-button mdl-button" onClick={this.handleButtonClick}>
          <i className="wgsa-button-icon material-icons">file_download</i>
          <span>Downloads</span>
        </button>
        <ul className="wgsa-menu__list mdl-shadow--2dp" onClick={this.handleMenuCicks}>
          <li>
            <span className="wgsa-menu-heading">Population Downloads</span>
            <ul className="wgsa-submenu">
              <li className="wgsa-menu__item">
                <a href={this.populationTreeLink}
                  target="_blank"
                  download={`${Species.nickname}_population_tree.nwk`}
                  className="mdl-button mdl-button--icon">
                  <i className="wgsa-button-icon material-icons">file_download</i>
                </a>
                Population Tree (.nwk)
              </li>
            </ul>
          </li>
          <li>
            <span className="wgsa-menu-heading">Collection Downloads</span>
            <ul className="wgsa-submenu">
              <li className="wgsa-menu__item">
                <a href={this.collectionTreeLink}
                  target="_blank"
                  download={`${this.collectionId}_collection_tree.nwk`}
                  className="mdl-button mdl-button--icon">
                  <i className="wgsa-button-icon material-icons">file_download</i>
                </a>
                Collection Tree (.nwk)
              </li>
              <li className="wgsa-menu__item">
                <DownloadButton
                  description="Kernel Checksum Distribution"
                  id={this.collectionId}
                  format="kernel_checksum_distribution" />
                Kernel Checksum Distribution
              </li>
              <li className="wgsa-menu__item">
                <DownloadButton
                  description="Concatenated Gene Family"
                  id={this.collectionId}
                  format="extended_kernel_fasta" />
                Concatenated Gene Family
              </li>
              <li className="wgsa-menu__item">
                <DownloadButton
                  description="Concatenated Gene Family"
                  id={this.collectionId}
                  format="score_matrix" />
                Score Matrix
              </li>
              <li className="wgsa-menu__item">
                <DownloadButton
                  description="Concatenated Gene Family"
                  id={this.collectionId}
                  format="differences_matrix" />
                Differences Matrix
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  },

  handleMenuCicks(event) {
    event.stopImmediatePropagation();
  },

  handleButtonClick() {
    this.setState({
      active: !this.state.active,
    });
  },

  handleBodyClickStoreChange() {
    const button = React.findDOMNode(this.refs.button);
    if (!this.state.active || BodyClickStore.getEvent().target === button) {
      return;
    }

    this.setState({
      active: false,
    });
  },

});
