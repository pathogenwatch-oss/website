import '../css/dropdown-menu.css';

import React from 'react';

import DownloadButton from './DownloadButton.react';

import UploadedCollectionStore from '../stores/UploadedCollectionStore';
import ReferenceCollectionStore from '../stores/ReferenceCollectionStore';
import BodyClickStore from '../stores/BodyClickStore';

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
    this.populationTreeLink = createBlobUrl(UploadedCollectionStore.getTree());
    this.collectionTreeLink = createBlobUrl(ReferenceCollectionStore.getTree());
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
        <ul className="wgsa-menu__list mdl-shadow--2dp">
          <li>
            <span className="wgsa-menu-heading">Species Downloads</span>
            <ul className="wgsa-submenu">
              <li className="wgsa-menu__item">
                <a href={this.populationTreeLink}
                  target="_blank"
                  download={`${this.collectionId}_population_tree.nwk`}
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
                <DownloadButton
                  id={this.collectionId}
                  type="collection"
                  format="kernel_checksum_distribution"
                  description="Kernal Checksum Distribution" />
                Kernal Checksum Distribution
              </li>
              <li className="wgsa-menu__item">
                <DownloadButton
                  id={this.collectionId}
                  type="collection"
                  format="extended_kernel_fasta"
                  description="Concatenated Gene Family" />
                Concatenated Gene Family
              </li>
              <li className="wgsa-menu__item">
                <a href={this.collectionTreeLink}
                  target="_blank"
                  download={`${this.collectionId}_collection_tree.nwk`}
                  className="mdl-button mdl-button--icon">
                  <i className="wgsa-button-icon material-icons">file_download</i>
                </a>
                Collection Tree (.nwk)
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
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
