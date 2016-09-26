import '../../css/drop-indicator.css';

import React from 'react';

import DEFAULT, { CGPS } from '^/defaults';

const style = {
  width: '100%',
  height: '100%',
  position: 'absolute',
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
    noAddButton: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      indicatorVisible: false,
    };
  },

  componentWillMount() {
    if (this.props.noAddButton) {
      style.cursor = 'pointer';
    }
  },

  handleFiles(fileList) {
    this.props.onFiles(Array.from(fileList));
  },

  handleDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ indicatorVisible: false });
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFiles(event.dataTransfer.files);
    }
  },

  showDropIndicator(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ indicatorVisible: true });
  },

  hideDropIndicator(event) {
    event.stopPropagation();
    event.preventDefault();
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
        onDragOver={this.showDropIndicator}
        onDrop={this.handleDrop}
        style={style}
        onClick={this.props.noAddButton ? this.handleClick : () => {}}
      >
        <div
          className={`wgsa-drop-indicator wgsa-overlay ${this.state.indicatorVisible ? 'wgsa-overlay--is-visible' : ''}`}
          onDragLeave={this.hideDropIndicator}
        >
          <div className="wgsa-drop-indicator__message">
            <div className="wgsa-drop-indicator__icons">
              <span className="wgsa-file-icon">
                <i className="material-icons" style={{ color: CGPS.COLOURS.PURPLE }}>insert_drive_file</i>
                <span className="wgsa-file-icon__label">.fasta</span>
              </span>
              <span className="wgsa-file-icon">
                <i className="material-icons" style={{ color: CGPS.COLOURS.GREEN }}>insert_drive_file</i>
                <span className="wgsa-file-icon__label">.csv</span>
              </span>
            </div>
            <h3 className="wgsa-drop-indicator__title">Drop to add to WGSA</h3>
          </div>
        </div>
        {this.props.children}
        { this.props.noAddButton ? null :
            <button className="mdl-button mdl-js-button mdl-button--fab wgsa-drag-and-drop__button mdl-shadow--3dp" title="Add files" onClick={this.handleClick}>
              <i className="material-icons">add</i>
            </button>
        }
        <input type="file" multiple="multiple" accept={DEFAULT.SUPPORTED_FILE_EXTENSIONS} ref="fileInput" style={fileInputStyle} onChange={this.handleFileInputChange} />
      </div>
    );
  },

});
