import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import DocumentTitle from '../../branding/DocumentTitle.react';
import FileDragAndDrop from '../drag-and-drop';
import Tabs from './Tabs.react';
import Assemblies from './Assemblies.react';
import Summary from '../Summary.react';

import { addFiles } from './actions';
import { fetchUploads } from '../previous/actions';

import { isReadsEligible, getUploadAccepts } from '../file-utils';

const Instructions = ({ onFiles, fetchPreviousUploads }) => {
  React.useEffect(() => {
    fetchPreviousUploads();
  }, []);

  const readsEligible = isReadsEligible();
  return (
    <FileDragAndDrop
      onFiles={onFiles}
      readsEligible={readsEligible}
      accept={getUploadAccepts(readsEligible)}
    >
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
    fetchPreviousUploads: () => dispatch(fetchUploads()),
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Instructions);
