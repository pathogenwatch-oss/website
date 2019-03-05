import React from 'react';

import { FormattedName } from '../../organisms';

export default () => (
  <React.Fragment>
    <div className="pw-upload-instructions-column">
      <h2>Genomic Data</h2>
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
        <tbody>
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
        </tbody>
      </table>
      <p>
        Files should contain <strong>DNA sequences</strong> of{' '}
        <strong>whole genomes</strong>. Please ensure that there are{' '}
        <strong>two paired-end reads files per genome</strong> as metagenomic
        samples are not supported.
      </p>
    </div>
    <div className="pw-upload-instructions-column">
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
        Files should contain a <strong>filename</strong> column to match each
        row to its respective genomic data. Please use either the common prefix
        (e.g. the <strong>lane ID</strong> or the <strong>strain name</strong>),
        or <strong>one of</strong> the names of the files including extension.
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
      <ul className="bulleted">
        <li>
          <a
            href="/pathogenwatch-metadata-template-reads.csv"
            download="pathogenwatch-metadata-template-reads.csv"
          >
            Minimal Example
          </a>
        </li>
        <li>
          <a
            href="/pathogenwatch-metadata-template-reads-typhi.csv"
            download="pathogenwatch-metadata-template-reads-typhi.csv"
          >
            <FormattedName organismId="90370" />
          </a>
        </li>
      </ul>
    </div>
  </React.Fragment>
);
