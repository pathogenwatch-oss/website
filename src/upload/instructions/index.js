import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from './drag-and-drop';
import Summary from '../Summary.react';
import Tabs from './Tabs.react';
import Assemblies from './Assemblies.react';
import DocumentTitle from '../../branding/DocumentTitle.react';

import { addFiles } from './actions';

import { isReadsEligible } from '../utils';

const Component = ({ onFiles }) => {
  const readsEligible = isReadsEligible();
  return (
    <FileDragAndDrop onFiles={onFiles} readsEligible={readsEligible}>
      <DocumentTitle>Upload</DocumentTitle>
      <div className="wgsa-hipster-style">
        <Summary />
        <section className="wgsa-page wgsa-compact-page wgsa-upload-instructions">
          <h1>Drag and drop files to begin.</h1>
          {readsEligible ? <Tabs /> : <Assemblies />}
        </section>
      </div>
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
