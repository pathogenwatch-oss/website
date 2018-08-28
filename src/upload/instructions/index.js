import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../../drag-and-drop';
import Instructions from './Instructions.react';
import Summary from '../Summary.react';

import { addFiles } from './actions';
import DocumentTitle from '../../branding/DocumentTitle.react';

const Component = ({ onFiles }) => (
  <FileDragAndDrop onFiles={onFiles}>
    <DocumentTitle>Upload</DocumentTitle>
    <div className="wgsa-hipster-style">
      <Summary />
      <Instructions />
    </div>
  </FileDragAndDrop>
);

function mapDispatchToProps(dispatch) {
  return {
    onFiles: files => dispatch(addFiles(files)),
  };
}

export default connect(null, mapDispatchToProps)(Component);
