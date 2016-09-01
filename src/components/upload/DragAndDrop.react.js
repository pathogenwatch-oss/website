import '../../css/drop-indicator.css';
import 'jquery-draghover';

import React from 'react';

import DEFAULT, { CGPS } from '^/defaults';

const style = {
  width: '100%',
  height: '100%',
};

const fileInputStyle = {
  position: 'fixed',
  zIndex: -1,
  opacity: 0,
};

export default React.createClass({

  displayName: 'DragAndDrop',

  propTypes: {
    onFiles: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      indicatorVisible: false,
    };
  },

  componentDidMount() {
    $('body').on('drop', (event) => {
      event.preventDefault();
      this.hideDropIndicator();
      this.handleDrop(event.originalEvent);
    });
    $.draghover({
      draghoverstart: () => {
        this.showDropIndicator();
      },
      draghoverend: () => {
        this.hideDropIndicator();
      },
    });
  },

  componentWillUnmount() {
    $('body').off('drop');
    $.draghover(false);
  },

  handleFiles(fileList) {
    this.props.onFiles(Array.from(fileList));
  },

  handleDrop(event) {
    event.preventDefault();

    this.hideDropIndicator();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFiles(event.dataTransfer.files);
    }
  },

  showDropIndicator() {
    this.setState({ indicatorVisible: true });
  },

  hideDropIndicator() {
    this.setState({ indicatorVisible: false });
  },

  handleClick() {
    this.refs.fileInput.click();
  },

  handleFileInputChange(event) {
    const { files } = event.target;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  },

  render() {
    return (
      <div
        className={`wgsa-drag-and-drop ${this.state.indicatorVisible ? 'is-dragover' : ''}`}
        onDrag={this.handleDrop}
        style={style}
      >
        <div className={`wgsa-drop-indicator wgsa-overlay ${this.state.indicatorVisible ? 'wgsa-overlay--is-visible' : ''}`}>
          <div className="wgsa-drop-indicator__message">
            <div className="wgsa-drop-indicator__icons">
              <span className="wgsa-file-icon">
                <i className="material-icons" style={{ color: CGPS.COLOURS.PURPLE }}>insert_drive_file</i>
                .fasta
              </span>
              <span className="wgsa-file-icon">
                <i className="material-icons" style={{ color: CGPS.COLOURS.GREEN }}>insert_drive_file</i>
                .csv
              </span>
            </div>
            <h3 className="wgsa-drop-indicator__title">Drop to add to WGSA</h3>
          </div>
        </div>
        {this.props.children}
        <button className="mdl-button mdl-js-button mdl-button--fab wgsa-drag-and-drop__button mdl-shadow--3dp" title="Add files" onClick={this.handleClick}>
          <i className="material-icons">add</i>
        </button>
        <input type="file" multiple="multiple" accept={DEFAULT.SUPPORTED_FILE_EXTENSIONS} ref="fileInput" style={fileInputStyle} onChange={this.handleFileInputChange} />
      </div>
    );
  },

});
