import React from 'react';
import classnames from 'classnames';
import { readAsText } from 'promise-file-reader';

import Fade from '../../../components/fade';
import CircularProgress from '../../../components/CircularProgress.react';

import { CSV_FILE_NAME_REGEX, parseMetadata } from '../../../upload/utils';
import MetadataUtils from '../../../utils/Metadata';

export default React.createClass({
  displayName: 'DropArea',

  propTypes: {
    onFiles: React.PropTypes.func.isRequired,
    noAddButton: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      indicatorVisible: false,
      uploading: false,
      rows: 0,
      completed: 0,
      error: null,
    };
  },

  upload(data, index) {
    const { id, ...row } = data[index];
    if (!id) {
      this.setState({
        error: 'Rows must contain IDs, please download existing metadata.',
      });
      return;
    }
    const metadata = parseMetadata(row);
    this.props
      .update(id, metadata)
      .then(() => {
        this.setState({ completed: this.state.completed + 1 }, () => {
          if (this.state.completed < this.state.rows && !this.state.error) {
            this.upload(data, index + 1);
          }
        });
      })
      .catch(e => {
        this.setState({ error: e.message });
      });
  },

  handleFiles(fileList) {
    const file = Array.from(fileList)[0];

    if (!CSV_FILE_NAME_REGEX.test(file.name)) return;

    readAsText(file)
      .then(contents => MetadataUtils.parseCsvToJson(contents))
      .then(({ data }) =>
        this.setState({ uploading: true, rows: data.length }, () =>
          this.upload(data, 0)
        )
      );
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
    if (this.state.error) {
      return <p>{this.state.error}</p>;
    }

    if (this.state.uploading) {
      const progress = Math.ceil(
        (this.state.completed / this.state.rows) * 100
      );
      return (
        <React.Fragment>
          <CircularProgress
            percentage={progress}
            radius="64"
            strokeWidth="12"
            decimalPlaces={0}
          />
          <Fade>
            {progress === 100 && (
              <p>{this.state.rows} genomes updated successfully.</p>
            )}
          </Fade>
        </React.Fragment>
      );
    }

    return (
      <form
        className={classnames('pw-update-metadata-form', {
          indicating: this.state.indicatorVisible,
        })}
        onDragOver={this.showDropIndicator}
        onDragLeave={this.hideDropIndicator}
        onDrop={this.handleDrop}
        onClick={this.handleClick}
      >
        {this.state.indicatorVisible ? (
          <p>Drop to upload</p>
        ) : (
          <React.Fragment>
            <p>2. Drag updated CSV here to update</p>
            <p>or click to select file</p>
          </React.Fragment>
        )}
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
