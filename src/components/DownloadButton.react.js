import '../css/spinner.css';

import React from 'react';

import DownloadStore from '../stores/DownloadStore';
import DownloadActionCreators from '../actions/DownloadActionCreators';

import DEFAULT from '../defaults';

const errorStyle = {
  color: DEFAULT.DANGER_COLOUR,
};

export default React.createClass({

  propTypes: {
    description: React.PropTypes.string,
    format: React.PropTypes.string,
    id: React.PropTypes.string,
  },

  getInitialState() {
    const { format, id } = this.props;
    const status = DownloadStore.getDownloadStatus(format, id) || {};
    return {
      loading: false,
      error: status.error,
      link: status.link,
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
        <i style={this.state.error ? errorStyle : {}} className="wgsa-button-icon material-icons">insert_drive_file</i>
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

    DownloadActionCreators.requestFile(this.props.format, this.props.id);
  },

  handleDownloadStoreChange() {
    const { format, id } = this.props;
    const status = DownloadStore.getDownloadStatus(format, id);
    if (status) {
      this.setState({
        loading: false,
        error: status.error,
        link: status.link,
      });
    }
  },

});
