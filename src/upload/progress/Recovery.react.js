import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../instructions/drag-and-drop';
import Summary from './Summary.react';

import * as upload from './selectors';

import { addFiles } from '../instructions/actions';

import { isReadsEligible } from '../utils';

const Recovery = ({ uploadedAt, onFiles, numSuccessful, remainingFiles }) => {
  const readsEligible = isReadsEligible();
  return (
    <FileDragAndDrop onFiles={onFiles} readsEligible={readsEligible}>
      <div className="wgsa-hipster-style">
        <Summary uploadedAt={uploadedAt} />
        <section className="pw-upload-page">
          <h1>Recover this session.</h1>
          {numSuccessful > 0 && (
            <p className="pw-with-icon success">
              <i className="material-icons">check_circle</i>
              {numSuccessful} file{numSuccessful === 1 ? ' was' : 's were'}{' '}
              successfully uploaded.
            </p>
          )}
          <p>Please re-upload the following files to continue:</p>
          <ul className="pw-upload-recovery-files">
            {remainingFiles.map(files => (
              <li key={files[0]}>
                <ul>
                  {files.map(file => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </FileDragAndDrop>
  );
};

function mapStateToProps(state) {
  return {
    numSuccessful: upload.getNumSuccessfulUploads(state),
    remainingFiles: upload.getPendingFiles(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFiles: files => dispatch(addFiles(files)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recovery);
