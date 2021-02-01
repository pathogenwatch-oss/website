import React from 'react';
import { connect } from 'react-redux';
import { readAsText } from 'promise-file-reader';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import DownloadLink from '../download/DownloadLink.react';
import DropArea from '~/components/drop-area';
import Fade from '~/components/fade';
import Limiter from '../Limiter.react';
import Progress from './Progress.react';

import { getSelectedGenomeIds } from '../selectors';

import { toggleDropdown } from '../actions';
import { sendMetadataUpdate } from './actions';

import { getServerPath } from '~/utils/Api';
import { CSV_FILENAME_REGEX, parseMetadata } from '~/utils/Metadata';
import MetadataUtils from '~/utils/Metadata';

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

  componentDidUpdate(_, previous) {
    if (!previous.result && this.state.result) {
      setTimeout(this.props.goBack, 1000);
    }
  }

  handleFiles(fileList) {
    const file = Array.from(fileList)[0];

    if (!CSV_FILENAME_REGEX.test(file.name)) return;

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
              data.map((row, i) => {
                if (!row.id) {
                  throw new Error(
                    'Every row must contain an ID, please download existing metadata before attempting to upload.'
                  );
                }
                try {
                  return {
                    id: row.id,
                    ...parseMetadata(row),
                  };
                } catch (e) {
                  e.message = `${e.message} (row ${i + 1})`;
                  throw e;
                }
              })
            )
            .then(result => this.setState({ result }))
            .catch(() =>
              this.setState({
                error: {
                  message: (
                    <React.Fragment>
                      Failed to update, please make sure you are the owner of
                      the genomes in the file.
                      <br />
                      {window.location.pathname !== '/genomes/user' && (
                        <Link to="/genomes/user">View genomes owned by you</Link>
                      )}
                    </React.Fragment>
                  ),
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
    const { ids, goBack } = this.props;
    const progress = (this.state.completed / this.state.rows) * 100;
    return (
      <div className="wgsa-dropdown">
        <header className="wgsa-dropdown-header">Edit Metadata</header>
        <Limiter type="maxDownloadSize">
          <Fade
            className="wgsa-dropdown-content pw-edit-metadata-section"
            out={false}
          >
            {this.state.uploading ? (
              <Progress
                key="progress"
                result={this.state.result}
                error={this.state.error}
              />
            ) : (
              <div className="pw-edit-metadata-instructions pw-edit-metadata-section">
                <p className="pw-edit-metadata-warning">
                  <i className="material-icons danger">warning</i>
                  This will overwrite existing data
                </p>
                <DownloadLink
                  className="pw-edit-metadata-link"
                  link={getServerPath('/download/genome/metadata')}
                  ids={ids}
                >
                  1. Download existing metadata for selected genomes
                </DownloadLink>
                <p>2. Make changes to the spreadsheet (e.g. in Excel)</p>
                <DropArea className="pw-edit-metadata-section" onFiles={this.handleFiles}>
                  <p>
                    3. Drag file here to upload <br />
                    or click to select file
                  </p>
                </DropArea>
              </div>
            )}
          </Fade>
        </Limiter>
        <footer className="wgsa-dropdown-footer wgsa-dropdown-footer--right">
          {!this.state.uploading && (
            <button
              className={classnames('mdl-button', {
                'mdl-button--raised mdl-button--colored': progress === 100,
              })}
              onClick={goBack}
            >
              Go back
            </button>
          )}
          <Fade>
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
