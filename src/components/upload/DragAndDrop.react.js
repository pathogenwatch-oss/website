import '../../css/drop-indicator.css';
import 'jquery-draghover';

import React from 'react';

import { CGPS } from '^/defaults';

const style = {
  width: '100%',
  height: '100%',
};

export default React.createClass({

  displayName: 'DragAndDrop',

  propTypes: {
    onDrop: React.PropTypes.func.isRequired,
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

  handleDrop(event) {
    event.preventDefault();

    this.hideDropIndicator();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      if (typeof this.props.onDrop === 'function') {
        this.props.onDrop(event.dataTransfer);
      }
    }
  },

  showDropIndicator() {
    this.setState({ indicatorVisible: true });
  },

  hideDropIndicator() {
    this.setState({ indicatorVisible: false });
  },

  render() {
    return (
      <div
        className={`wgsa-drag-and-drop ${this.state.indicatorVisible ? 'is-dragover' : ''}`}
        onDragStart={this.handleDragStart}
        onDrag={this.handleDrop}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDragEnd={this.handleDragEnd}
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
      </div>
    );
  },

});
