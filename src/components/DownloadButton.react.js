import '../css/spinner.css';

import React from 'react';

import DownloadStore from '../stores/DownloadStore';
import DownloadActionCreators from '../actions/DownloadActionCreators';

import { CGPS } from '../defaults';

export default React.createClass({

  propTypes: {
    description: React.PropTypes.string,
    id: React.PropTypes.string,
    format: React.PropTypes.string,
  },

  getInitialState() {
    return {
      loading: false,
      link: null,
    };
  },

  componentDidMount() {
    DownloadStore.addChangeListener(this.handleDownloadStoreChange);
  },

  componentDidUpdate() {
    if (this.state.loading) {
      componentHandler.upgradeElement(React.findDOMNode(this.refs.spinner));
    }
  },

  componentWillUnmount() {
    DownloadStore.removeChangeListener(this.handleDownloadStoreChange);
  },

  getDownloadElement() {
    if (this.state.link) {
      return (
        <a className="mdl-button mdl-button--icon" target="_blank" href={this.state.link} title={`Download ${this.props.description}`}>
          <i className="wgsa-button-icon material-icons">file_download</i>
        </a>
      );
    }

    return (
      <button className="mdl-button mdl-button--icon" onClick={this.handleGenerateFile} title={`Generate ${this.props.description}`}>
        <i className="wgsa-button-icon material-icons">insert_drive_file</i>
      </button>
    );
  },

  render() {
    return (
      <div className="wgsa-download-button">
        { this.state.loading ?
            <div ref="spinner" className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
            :
            this.getDownloadElement() }
      </div>
    );
  },

  handleGenerateFile() {
    this.setState({
      loading: true,
    });

    DownloadActionCreators.requestFile(this.props.id, this.props.format);
  },

  handleDownloadStoreChange() {
    const link = DownloadStore.getLink(this.props.id, this.props.format);
    if (link) {
      this.setState({
        loading: false,
        link,
      });
    }
  },

});
