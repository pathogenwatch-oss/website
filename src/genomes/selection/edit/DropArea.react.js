import React from 'react';
import classnames from 'classnames';

import Fade from '../../../components/fade';

export default React.createClass({
  displayName: 'DropArea',

  propTypes: {
    onFiles: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      indicatorVisible: false,
    };
  },

  handleDrop(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ indicatorVisible: false });
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.props.onFiles(event.dataTransfer.files);
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
      this.props.onFiles(files);
      event.target.value = null;
    }
  },

  render() {
    return (
      <form
        className={classnames(
          'pw-edit-metadata-form pw-edit-metadata-section',
          {
            indicating: this.state.indicatorVisible,
          }
        )}
        onDragOver={this.showDropIndicator}
        onDragLeave={this.hideDropIndicator}
        onDrop={this.handleDrop}
        onClick={this.handleClick}
      >
        <Fade out={false}>
          {this.state.indicatorVisible ? (
            <p key="drop">
              <strong>Drop to upload</strong>
            </p>
          ) : (
            this.props.children
          )}
        </Fade>
        <input
          type="file"
          multiple="multiple"
          accept=".csv"
          ref="fileInput"
          onChange={this.handleFileInputChange}
        />
      </form>
    );
  },
});
