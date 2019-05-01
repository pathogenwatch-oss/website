import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '~/upload/drag-and-drop';

import { useAssemblerSession } from '../assembly/hooks';

import { getNumSuccessfulUploads } from '../files/selectors';
import { getPendingFiles } from './selectors';

import { recoverUploadSession } from './actions';

import { isReadsEligible } from '../../utils';

const Recovery = ({
  uploadedAt,
  token,
  onFiles,
  numSuccessful,
  remainingFiles,
}) => {
  const readsEligible = isReadsEligible();
  const [ session, error ] = useAssemblerSession(uploadedAt, token);

  if (error) {
    return (
      <section className="pw-upload-page">
        <h1>Sorry, there's a problem.</h1>
        <p>{error.message}</p>
      </section>
    );
  }

  if (session) {
    return (
      <FileDragAndDrop
        onFiles={files => onFiles(files, session, uploadedAt)}
        readsEligible={readsEligible}
      >
        <section className="pw-upload-page pw-upload-recovery">
          <h1>Recover this session.</h1>
          {numSuccessful > 0 && (
            <p className="pw-with-icon success">
              <i className="material-icons">check_circle</i>
              {numSuccessful} genome{numSuccessful === 1 ? ' has' : 's have'}{' '}
              been successfully uploaded.
            </p>
          )}
          <p>Please drag and drop these files to continue:</p>
          <ul className="pw-upload-recovery-files">
            {remainingFiles.map(files => (
              <li key={files[0]}>
                <ul>
                  {files.map(file => (
                    <li key={file}>
                      <span className="wgsa-file-icon">
                        <i className="material-icons">insert_drive_file</i>
                      </span>
                      {file}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </FileDragAndDrop>
    );
  }

  return null;
};

function mapStateToProps(state) {
  return {
    numSuccessful: getNumSuccessfulUploads(state),
    remainingFiles: getPendingFiles(state),
    token: state.auth.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFiles: (files, session) => dispatch(recoverUploadSession(files, session)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recovery);
