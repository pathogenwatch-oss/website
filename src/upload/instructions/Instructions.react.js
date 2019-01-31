import './styles.css';

import React from 'react';

import { FormattedName } from '../../organisms';

import { ASSEMBLY_FILE_EXTENSIONS } from '../../app/constants';

export default () => (
  <section className="wgsa-page wgsa-compact-page wgsa-upload-instructions">
    <h1>Drag and drop files to begin.</h1>
    <div>
      <h2>Genomic Data</h2>
      <p>
        Please ensure that there is <strong>one file per genome</strong>.
      </p>
      <h3>
        Reads <i className="material-icons">fiber_new</i>
      </h3>
      <p>
        One or more <strong>pairs of files</strong> in gzip-compressed{' '}
        <a
          href="https://en.wikipedia.org/wiki/FASTQ_format"
          target="_blank"
          rel="noopener"
        >
          FASTQ format
        </a>{' '}
        with one of the following extensions:
      </p>
      <table cellPadding="0" cellSpacing="0">
        <tr>
          <td>_1.fastq.gz</td>
          <td>_2.fastq.gz</td>
        </tr>
        <tr>
          <td>.1.fastq.gz</td>
          <td>.2.fastq.gz</td>
        </tr>
        <tr>
          <td>_R1.fastq.gz</td>
          <td>_R2.fastq.gz</td>
        </tr>
        <tr>
          <td>.R1.fastq.gz</td>
          <td>.R2.fastq.gz</td>
        </tr>
      </table>
      <h3>Assemblies</h3>
      <p>
        One or more files in{' '}
        <a
          href="https://en.wikipedia.org/wiki/FASTA_format"
          target="_blank"
          rel="noopener"
        >
          multi-FASTA format
        </a>{' '}
        with one of the following extensions:
      </p>
      <ul className="inline">
        {ASSEMBLY_FILE_EXTENSIONS.map(ext => (
          <li key={ext}>{ext}</li>
        ))}
      </ul>
    </div>
    <div>
      <h2>Metadata</h2>
      <p>
        One or more files in{' '}
        <a
          href="https://en.wikipedia.org/wiki/Comma-separated_values"
          target="_blank"
          rel="noopener"
        >
          CSV format
        </a>{' '}
        with the extension <strong>.csv</strong>.
      </p>
      <p>
        Files should have a <strong>filename</strong> column. For{' '}
        <strong>reads</strong>, use the prefix or one of the names of the files.
        For <strong>assemblies</strong>, use the name of the file exactly.
      </p>
      <p>
        To make full use of metadata, we strongly recommend including the
        following columns:
      </p>
      <ul className="inline">
        <li>latitude</li>
        <li>longitude</li>
        <li>year</li>
        <li>month</li>
        <li>day</li>
      </ul>
      <p>
        When providing a date, month and day are optional. Additional metadata
        may be included and will be saved.
      </p>
      <h3>CSV Templates</h3>
      <ul>
        <li>
          <a
            href="/pathogenwatch-general-metadata-template.csv"
            download="pathogenwatch-general-metadata-template.csv"
          >
            General
          </a>
        </li>
        <li>
          <a
            href="/pathogenwatch-typhi-metadata-template.csv"
            download="pathogenwatch-typhi-metadata-template.csv"
          >
            <FormattedName organismId="90370" />
          </a>
        </li>
      </ul>
    </div>
  </section>
);
