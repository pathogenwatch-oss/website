import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../instructions/drag-and-drop';
import Summary from './Summary.react';

import { useAssemblerSession } from './hooks';

import * as upload from './selectors';

import { recoverUploadSession } from './actions';

import { isReadsEligible } from '../utils';

const ContentWrapper = ({ uploadedAt, children }) => (
  <div className="wgsa-hipster-style">
    <Summary uploadedAt={uploadedAt} />
    <section className="pw-upload-page">{children}</section>
  </div>
);

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
      <ContentWrapper uploadedAt={uploadedAt}>
        <h1>Sorry, there's a problem.</h1>
        <p>{error.message}</p>
      </ContentWrapper>
    );
  }

  if (session) {
    return (
      <FileDragAndDrop
        onFiles={files => onFiles(files, session)}
        readsEligible={readsEligible}
      >
        <ContentWrapper uploadedAt={uploadedAt}>
          <h1>Recover this session.</h1>
          {numSuccessful > 0 && (
            <p className="pw-with-icon success">
              <i className="material-icons">check_circle</i>
              {numSuccessful} file{numSuccessful === 1 ? ' was' : 's were'}{' '}
              successfully uploaded.
            </p>
          )}
          <p>Please re-upload these files to continue:</p>
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
        </ContentWrapper>
      </FileDragAndDrop>
    );
  }

  return <ContentWrapper />;
};

function mapStateToProps(state) {
  return {
    numSuccessful: upload.getNumSuccessfulUploads(state),
    remainingFiles: upload.getPendingFiles(state),
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
