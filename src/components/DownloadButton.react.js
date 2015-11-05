import '../css/spinner.css';

import React from 'react';

import DownloadStore from '../stores/DownloadStore';
import FilteredDataStore from '../stores/FilteredDataStore';

import DownloadActionCreators from '../actions/DownloadActionCreators';

import DEFAULT from '../defaults';

const errorStyle = {
  color: DEFAULT.DANGER_COLOUR,
};

const MOUNTED_BUTTONS = new Set();

function changeListener() {
  for (const component of MOUNTED_BUTTONS) {
    component.setState(component.getInitialState());
  }
}

DownloadStore.addChangeListener(changeListener);
FilteredDataStore.addChangeListener(changeListener);

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
    MOUNTED_BUTTONS.add(this);
  },

  componentDidUpdate() {
    if (this.state.loading) {
      componentHandler.upgradeElement(this.refs.spinner);
    }
  },

  componentWillUnmount() {
    MOUNTED_BUTTONS.delete(this);
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

});
