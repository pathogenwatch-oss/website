import React from 'react';

import { Name } from '~/branding';

import Overlay from '~/components/overlay';

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
      this.style.cursor = 'pointer';
    }
  },

  style: {},

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
      event.target.value = null;
    }
  },

  render() {
    const { readsEligible, accept } = this.props;
    return (
      <div
        className={`wgsa-drag-and-drop ${
          this.state.indicatorVisible ? 'is-dragover' : ''
        }`}
        onDragOver={this.showDropIndicator}
        onDrop={this.handleDrop}
        style={this.style}
        onClick={this.props.noAddButton ? this.handleClick : () => {}}
      >
        <Overlay
          visible={this.state.indicatorVisible}
          className="wgsa-drop-indicator"
          onDragLeave={this.hideDropIndicator}
        >
          <div className="wgsa-drop-indicator__message">
            <div className="wgsa-drop-indicator__icons">
              {readsEligible && (
                <span className="wgsa-file-icon wgsa-file-icon--purple">
                  <i className="material-icons">file_copy</i>
                  <span className="wgsa-file-icon__label">.fastq.gz</span>
                </span>
              )}
              <span className="wgsa-file-icon wgsa-file-icon--purple">
                <i className="material-icons">insert_drive_file</i>
                <span className="wgsa-file-icon__label">.fasta</span>
              </span>
              <span className="wgsa-file-icon wgsa-file-icon--green">
                <i className="material-icons">insert_drive_file</i>
                <span className="wgsa-file-icon__label">.csv</span>
              </span>
            </div>
            <p className="wgsa-drop-indicator__title h2 title-font">
              Drop to add to <Name />
            </p>
          </div>
        </Overlay>
        {this.props.children}
        {this.props.noAddButton ? null : (
          <button
            className="mdl-button mdl-js-button mdl-button--fab wgsa-drag-and-drop__button mdl-shadow--3dp"
            title="Add files"
            onClick={this.handleClick}
          >
            <i className="material-icons">add</i>
          </button>
        )}
        <input
          type="file"
          multiple="multiple"
          ref="fileInput"
          accept={accept}
          style={fileInputStyle}
          onChange={this.handleFileInputChange}
        />
      </div>
    );
  },
});
