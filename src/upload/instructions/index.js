import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from './drag-and-drop';
import Instructions from './Instructions.react';
import Summary from '../Summary.react';
import DocumentTitle from '../../branding/DocumentTitle.react';

import { getAssemblerUsage } from './selectors';

import { addFiles, fetchAssemblerUsage } from './actions';

import { isReadsEligible } from '../utils';

const Component = ({ onFiles, fetchUsage, token, usage }) => {
  React.useEffect(() => {
    if (token) {
      fetchUsage(token);
    }
  }, [ token ]);
  const readsEligible = isReadsEligible();
  return (
    <FileDragAndDrop onFiles={onFiles} readsEligible={readsEligible}>
      <DocumentTitle>Upload</DocumentTitle>
      <div className="wgsa-hipster-style">
        <Summary />
        <Instructions usage={usage} readsEligible />
      </div>
    </FileDragAndDrop>
  );
};

function mapStateToProps(state) {
  return {
    usage: getAssemblerUsage(state),
    token: state.auth.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsage: token => dispatch(fetchAssemblerUsage(token)),
    onFiles: files => dispatch(addFiles(files)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
