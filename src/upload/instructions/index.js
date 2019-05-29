import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import DocumentTitle from '../../branding/DocumentTitle.react';
import FileDragAndDrop from '../drag-and-drop';
import Tabs from './Tabs.react';
import Assemblies from './Assemblies.react';
import Summary from '../Summary.react';

import { addFiles } from './actions';

import { isReadsEligible } from '../file-utils';

const Component = ({ onFiles }) => {
  const readsEligible = isReadsEligible();
  return (
    <FileDragAndDrop onFiles={onFiles} readsEligible={readsEligible}>
      <DocumentTitle>Upload</DocumentTitle>
      <Summary />
      <section className="wgsa-page wgsa-compact-page wgsa-upload-instructions">
        <h1>Drag and drop files to begin.</h1>
        {readsEligible ? <Tabs /> : <Assemblies />}
      </section>
    </FileDragAndDrop>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    onFiles: files => dispatch(addFiles(files)),
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Component);
