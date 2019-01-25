import React from 'react';
import { connect } from 'react-redux';
import { readAsText } from 'promise-file-reader';
import classnames from 'classnames';

import DownloadLink from '../download/DownloadLink.react';
import DropArea from './DropArea.react';
import Progress from './Progress.react';
import Fade from '../../../components/fade';

import { getSelectedGenomeIds } from '../selectors';

import { toggleDropdown } from '../actions';
import { updateGenome } from '../../../upload/progress/actions';

import { getServerPath } from '../../../utils/Api';
import { CSV_FILE_NAME_REGEX, parseMetadata } from '../../../upload/utils';
import MetadataUtils from '../../../utils/Metadata';

function getInitialState() {
  return {
    uploading: false,
    rows: 0,
    completed: 0,
    error: null,
  };
}

class UpdateMetadata extends React.Component {
  constructor() {
    super();
    this.state = getInitialState();
    this.handleFiles = this.handleFiles.bind(this);
    this.upload = this.upload.bind(this);
  }

  upload(data, index) {
    const { id, ...row } = data[index];
    if (!id) {
      this.setState({
        error: {
          row: index + 1,
          message:
            'This row does not contain an ID, please download existing metadata before attempting to upload',
        },
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
      .catch(() => {
        this.setState({
          error: {
            row: index + 1,
            message: `This row could not be uploaded, please make sure you are the owner of ${
              metadata.name
            }`,
          },
        });
      });
  }

  handleFiles(fileList) {
    const file = Array.from(fileList)[0];

    if (!CSV_FILE_NAME_REGEX.test(file.name)) return;

    readAsText(file)
      .then(contents => MetadataUtils.parseCsvToJson(contents))
      .then(({ data, errors }) => {
        if (errors.length > 0) {
          const [ { row, message } ] = errors;
          this.setState({ error: { row: row + 1, message } });
        } else {
          this.setState({ uploading: true, rows: data.length }, () =>
            this.upload(data, 0)
          );
        }
      });
  }

  render() {
    const { ids, goBack, update } = this.props;
    const progress = (this.state.completed / this.state.rows) * 100;
    return (
      <div className="wgsa-dropdown">
        <header className="wgsa-dropdown-header">Update Metadata</header>
        <Fade
          className="wgsa-dropdown-content pw-update-metadata-section"
          out={false}
        >
          {this.state.uploading ? (
            <Progress
              key="progress"
              rows={this.state.rows}
              progress={progress}
              reset={() => this.setState(getInitialState())}
              error={this.state.error}
            />
          ) : (
            <div className="pw-update-metadata-instructions pw-update-metadata-section">
              <p className="pw-update-metadata-warning">
                <i className="material-icons">warning</i>
                This will overwrite existing data
              </p>
              <DownloadLink
                className="pw-update-metadata-link"
                link={getServerPath('/download/genome/metadata')}
                ids={ids}
              >
                1. Download existing metadata for selected genomes
              </DownloadLink>
              <DropArea update={update} onFiles={this.handleFiles} />
            </div>
          )}
        </Fade>
        <footer className="wgsa-dropdown-footer wgsa-dropdown-footer--right">
          <button
            className={classnames('mdl-button', {
              'mdl-button--raised mdl-button--colored': progress === 100,
            })}
            onClick={goBack}
          >
            Go back
          </button>
        </footer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ids: getSelectedGenomeIds(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(toggleDropdown('selection')),
    update: (id, metadata) => dispatch(updateGenome(id, metadata)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateMetadata);
