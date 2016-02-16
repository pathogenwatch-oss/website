import '../../css/drop-indicator.css';

import React from 'react';

import { CGPS } from '^/defaults';

const style = {
  width: '100%',
  height: '100%',
};

export default React.createClass({

  displayName: 'DragAndDrop',

  propTypes: {
    onDragStart: React.PropTypes.func,
    onDrop: React.PropTypes.func.isRequired,
    onDragEnter: React.PropTypes.func,
    onDragLeave: React.PropTypes.func,
    onDragOver: React.PropTypes.func,
    onDragEnd: React.PropTypes.func,
  },

  getInitialState() {
    return {
      indicatorVisible: false,
    };
  },

  handleDragStart(event) {
    if (typeof this.props.onDragStart === 'function') {
      this.props.onDragStart(event);
    }
  },

  handleDrag(event) {
    if (typeof this.props.onDrag === 'function') {
      this.props.onDrag(event);
    }
  },

  handleDragEnter(event) {
    this.showDropIndicator();
    if (typeof this.props.onDragEnter === 'function') {
      this.props.onDragEnter(event);
    }
  },

  handleDragLeave(event) {
    this.hideDropIndicator();
    if (typeof this.props.onDragLeave === 'function') {
      this.props.onDragLeave(event);
    }
  },

  handleDragOver(event) {
    event.preventDefault();

    this.showDropIndicator();
    if (typeof this.props.onDragOver === 'function') {
      this.props.onDragOver(event);
    }
  },

  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    this.hideDropIndicator();
    if (event.dataTransfer.files.length > 0) {
      if (typeof this.props.onDrop === 'function') {
        this.props.onDrop(event.dataTransfer);
      }
    }
  },

  handleDragEnd(event) {
    this.hideDropIndicator();
    if (typeof this.props.onDragEnd === 'function') {
      this.props.onDragEnd(event);
    }
  },

  showDropIndicator() {
    if (! this.state.indicatorVisible) {
      this.setState({ indicatorVisible: true });
    }
  },

  hideDropIndicator() {
    if (this.state.indicatorVisible) {
      this.setState({ indicatorVisible: false });
    }
  },

  render() {
    return (
      <div
        onDragStart={this.handleDragStart}
        onDrag={this.handleDrop}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        onDragEnd={this.handleDragEnd}
        style={style}
      >
        <div className={`wgsa-drop-indicator ${this.state.indicatorVisible ? 'is-dragover' : ''}`}>
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
      </div>
    );
  },

});
