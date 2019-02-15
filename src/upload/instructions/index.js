import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../../drag-and-drop';
import Instructions from './Instructions.react';
import Summary from '../Summary.react';

import { getAssemblyLimits } from './selectors';

import { addFiles, fetchAssemblyLimits } from './actions';
import DocumentTitle from '../../branding/DocumentTitle.react';

const Component = ({ onFiles, fetchLimits, token }) => {
  React.useEffect(() => {
    if (token) {
      fetchLimits(token);
    }
  }, [ token ]);
  return (
    <FileDragAndDrop onFiles={onFiles}>
      <DocumentTitle>Upload</DocumentTitle>
      <div className="wgsa-hipster-style">
        <Summary />
        <Instructions />
      </div>
    </FileDragAndDrop>
  );
};

function mapStateToProps(state) {
  return {
    limits: getAssemblyLimits(state),
    token: state.auth.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLimits: token => dispatch(fetchAssemblyLimits(token)),
    onFiles: files => dispatch(addFiles(files)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
