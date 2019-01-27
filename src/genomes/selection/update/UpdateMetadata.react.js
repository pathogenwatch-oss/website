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
import { sendMetadataUpdate } from './actions';

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
  }

  handleFiles(fileList) {
    const file = Array.from(fileList)[0];

    if (!CSV_FILE_NAME_REGEX.test(file.name)) return;

    this.setState({ uploading: true }, () =>
      readAsText(file)
        .then(contents => MetadataUtils.parseCsvToJson(contents))
        .then(({ data, errors }) => {
          if (errors.length > 0) {
            const [ { row, message } ] = errors;
            this.setState({ error: { row: row + 1, message } });
            return;
          }
          this.props
            .update(
              data.map(row => {
                if (!row.id) {
                  throw new Error(
                    'Every row must contain an ID, please download existing metadata before attempting to upload.'
                  );
                }
                return {
                  id: row.id,
                  ...parseMetadata(row),
                };
              })
            )
            .then(result => this.setState({ result }))
            .catch(() =>
              this.setState({
                error: {
                  message:
                    'Failed to update, please make sure you are the owner of the genomes in the file.',
                },
              })
            );
        })
        .catch(e =>
          this.setState({
            error: {
              message: e.message,
            },
          })
        )
    );
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
              result={this.state.result}
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
          <Fade out={false}>
            {this.state.error && (
              <button
                className="mdl-button mdl-button--raised mdl-button--colored"
                onClick={() => this.setState(getInitialState())}
              >
                Try Again
              </button>
            )}
          </Fade>
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
    update: data => dispatch(sendMetadataUpdate(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateMetadata);
