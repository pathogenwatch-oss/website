import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
    <div
      onFiles={onFiles}
      readsEligible={readsEligible}
      accept={getUploadAccepts(readsEligible)}
    >
      <DocumentTitle>Upload</DocumentTitle>
      <Summary />
      <section className="wgsa-page wgsa-compact-page wgsa-upload-instructions">
        <h1>What would you like to upload?</h1>

        <div className="pw-upload-types">
          <Link
            to="/upload/fasta"
            className="pw-upload-card"
          >
            <figure>
              <img width="80px" src="/images/icons/one-genome-per-file.svg" />
            </figure>
            <h3>FASTA</h3>
            <p>
              One genome per file
              <br />
              (e.g. bacterial genomes)
            </p>
            <span>
              Upload FASTA
            </span>
          </Link>
          <Link
            to="/upload/multi-fasta"
            className="pw-upload-card"
          >
            <figure>
              <img width="80px" src="/images/icons/multiple-genomes-per-file.svg" />
            </figure>
            <h3>Multi FASTA</h3>
            <p>
              Multiple genomes per file
              <br />
              (e.g. viral genomes)
            </p>
            <span>
              Upload Multi FASTA
            </span>
          </Link>
          <Link
            to="/upload/reads"
            className="pw-upload-card"
          >
            <figure>
              <img width="140px" src="/images/icons/read-files.svg" />
            </figure>
            <h3>FASTQ</h3>
            <p>
              Pairs of read files
              <br />
              in FASTQ format
            </p>
            <span>
              Upload FASTQ
            </span>
          </Link>
        </div>
        
      </section>
    </div>
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
