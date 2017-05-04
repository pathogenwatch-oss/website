import './styles.css';

import React from 'react';

import { DEFAULT } from '../../app/constants';

export default () => (
  <section className="wgsa-upload-instuctions">
    <h2>Drag and drop files to begin.</h2>
    <div>
      <h3>Genomic Data</h3>
      <p>
        Genomic data should be in <a href="https://en.wikipedia.org/wiki/FASTA_format" target="_blank" rel="noopener">multi-FASTA format</a> with one of the following extensions:
      </p>
      <ul>
        {DEFAULT.GENOME_FILE_EXTENSIONS.map(ext => <li key={ext}>{ext}</li>)}
      </ul>
      <p>Please ensure that there is <strong>one file per genome</strong>.</p>
    </div>
    <div>
      <h3>Metadata</h3>
      <p>Metadata should be provided in <a href="https://en.wikipedia.org/wiki/Comma-separated_values" target="_blank" rel="noopener">CSV format</a> with the extension <strong>.csv</strong>.</p>
      <p>Files should contain a column <strong>filename</strong> containing the names of genome files uploaded at the same time.</p>
      <p>To make full use of metadata, we strongly recommend including the following columns:</p>
      <ul>
        <li>latitude</li>
        <li>longitude</li>
        <li>year</li>
        <li>month</li>
        <li>day</li>
      </ul>
      <p>When providing a date, month and day are optional. Additional columns may be included to explore within your dataset.</p>
      <a href="/example-metadata.csv" download="wgsa-example-metadata.csv">
        Download an example metadata file
      </a>
    </div>
  </section>
);
