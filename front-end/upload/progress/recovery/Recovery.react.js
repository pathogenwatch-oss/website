import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../../drag-and-drop';

import { getNumSuccessfulUploads } from '../files/selectors';
import { getPendingFiles } from './selectors';

import { recoverUploadSession } from './actions';

import { getUploadAccepts } from '../../file-utils';

const readsEligible = true;

const Recovery = ({
  onFiles,
  numSuccessful,
  remainingFiles,
}) => (
  <FileDragAndDrop
    onFiles={onFiles}
    readsEligible={readsEligible}
    accept={getUploadAccepts()}
  >
    <section className="pw-upload-page pw-upload-recovery">
      <h1>Recover this session.</h1>
      {numSuccessful > 0 && (
        <p className="pw-with-icon success">
          <i className="material-icons">check_circle</i>
          {numSuccessful} genome{numSuccessful === 1 ? '' : 's'} uploaded
            successfully
        </p>
      )}
      <p>Please drag and drop these files to continue:</p>
      <ul className="pw-upload-recovery-files">
        {remainingFiles.map((files) => (
          <li key={files[0]}>
            <span className="wgsa-file-icon">
              <i className="material-icons">
                {files.length === 1 ? 'insert_drive_file' : 'file_copy'}
              </i>
            </span>
            <ul>
              {files.map((file) => (
                <li key={file}>{file}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  </FileDragAndDrop>
);

function mapStateToProps(state) {
  return {
    numSuccessful: getNumSuccessfulUploads(state),
    remainingFiles: getPendingFiles(state),
  };
}

function mapDispatchToProps(dispatch, { session }) {
  return {
    onFiles: (files) => dispatch(recoverUploadSession(files, session)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recovery);
