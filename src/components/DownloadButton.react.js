import React from 'react';

import DownloadStore from '../stores/DownloadStore';
import DownloadActionCreators from '../actions/DownloadActionCreators';

import { CGPS } from '../defaults';

const iconStyle = {
  color: CGPS.COLOURS.PURPLE,
};

export default React.createClass({

  propTypes: {
    description: true,
    id: true,
    type: true,
    format: true,
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

  componentWillUnmount() {
    DownloadStore.removeChangeListener(this.handleDownloadStoreChange);
  },

  componentDidUpdate() {
    if (this.state.loading) {
      componentHandler.upgradeElement(React.findDOMNode(this.refs.spinner));
    }
  },

  render() {
    return this.state.loading ? (
      <div ref="spinner" className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
    ) : (
      this.getDownloadElement()
    );
  },

  getDownloadElement() {
    if (this.state.link) {
      return (
        <a className="mdl-button mdl-button--icon" target="_blank" href={this.state.link} title={`Download ${this.props.description}`}>
          <i style={iconStyle} className="wgsa-button-icon material-icons">file_download</i>
        </a>
      );
    }

    return (
      <button className="mdl-button mdl-button--icon" onClick={this.handleGenerateFile} title={`Generate ${this.props.description}`}>
        <i style={iconStyle} className="wgsa-button-icon material-icons">insert_drive_file</i>
      </button>
    );
  },

  handleGenerateFile() {
    this.setState({
      loading: true,
    });

    DownloadActionCreators.requestFile(this.props.id, this.props.type, this.props.format);
  },

  handleDownloadStoreChange() {
    const link = DownloadStore.getLink(this.props.id, this.props.type);
    if (link) {
      this.setState({
        loading: false,
        link,
      });
    }
  },

});
