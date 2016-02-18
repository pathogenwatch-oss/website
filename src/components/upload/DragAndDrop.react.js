import '../../css/drop-indicator.css';
import '^/../public/assets/jquery-ui/jquery.draghover.js';

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

  componentDidMount() {
    $('body').on('drop', (event) => {
      event.preventDefault();
      this.handleDrop(event.originalEvent);
    });
    this.draghover = $(window).draghover().on({
      draghoverstart: (e, event, winssb) => {
        let hasFiles = false;
        if (event && event.originalEvent && event.originalEvent.dataTransfer
          && event.originalEvent.dataTransfer.types) {
          for (const type of event.originalEvent.dataTransfer.types) {
            if (type.toLowerCase() === 'files') {
              hasFiles = true;
              break;
            }
          }
        }
        if (!hasFiles) {
          hasFiles = !!winssb;
        }
        if (hasFiles) {
          this.showDropIndicator();
        }
      },
      draghoverend: () => {
        this.hideDropIndicator();
      },
    });
  },

  componentWillUnmount() {
    $('body').off('drop');
    this.draghover.trigger('draghoverunbind');
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
    if (typeof this.props.onDragEnter === 'function') {
      this.props.onDragEnter(event);
    }
  },

  handleDragLeave(event) {
    if (typeof this.props.onDragLeave === 'function') {
      this.props.onDragLeave(event);
    }
  },

  handleDragOver(event) {
    event.preventDefault();

    if (typeof this.props.onDragOver === 'function') {
      this.props.onDragOver(event);
    }
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

  handleDragEnd(event) {
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
        className={`wgsa-drag-and-drop ${this.state.indicatorVisible ? 'is-dragover' : ''}`}
        onDragStart={this.handleDragStart}
        onDrag={this.handleDrop}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDragEnd={this.handleDragEnd}
        style={style}
      >
        <div className="wgsa-drop-indicator">
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
