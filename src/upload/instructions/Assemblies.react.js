import React from 'react';

import SettingsSwitch from './SettingsSwitch.react';
import { FormattedName } from '../../organisms';

import { ASSEMBLY_FILE_EXTENSIONS } from '../../app/constants';

export default () => (
  <React.Fragment>
    <div className="pw-upload-instructions-column">
      <h2>Genomic Data</h2>
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
      <p>
        Files should contain <strong>assembled DNA sequences</strong> of{' '}
        <strong>whole genomes</strong>. Please ensure that there is{' '}
        <strong>one file per genome</strong> as metagenomic samples are not
        supported.
      </p>
      <h2>Settings</h2>
      <p>
        <SettingsSwitch setting="compression">
          <strong>Compress files</strong>
        </SettingsSwitch>
        <small>Recommended for slow connections.</small>
      </p>
      <p>
        <SettingsSwitch setting="individual">
          <strong>Upload files individually</strong>
        </SettingsSwitch>
        <small>Recommended for unstable connections.</small>
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
        row to its respective genomic data. Please use the name of the file{' '}
        <strong>including extension</strong>.
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
        When providing a date, month and day are optional. Coordinates should be
        provided in decimal degrees. Additional metadata may be included and
        will be saved.
      </p>
      <h3>CSV Templates</h3>
      <ul className="bulleted">
        <li>
          <a
            href="/pathogenwatch-metadata-template-minimal.csv"
            download="pathogenwatch-metadata-template-minimal.csv"
          >
            Minimal
          </a>
        </li>
        <li>
          <a
            href="/pathogenwatch-metadata-template-typhi.csv"
            download="pathogenwatch-metadata-template-typhi.csv"
          >
            <FormattedName organismId="90370" />
          </a>
        </li>
      </ul>
    </div>
  </React.Fragment>
);
