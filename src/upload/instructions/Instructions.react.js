import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Switch from '../../components/switch';
import { FormattedName } from '../../organisms';

import { getSettingValue } from './selectors';

import { changeUploadSetting } from './actions';

import { DEFAULT } from '../../app/constants';

function mapStateToProps(state, { setting }) {
  return {
    checked: getSettingValue(state, setting),
  };
}

function mapDispatchToProps(dispatch, { setting }) {
  return {
    onChange: checked => dispatch(changeUploadSetting(setting, checked)),
  };
}

const SettingsSwitch = connect(mapStateToProps, mapDispatchToProps)(
  ({ checked, onChange, children }) => (
    <Switch checked={checked} onChange={onChange}>
      {children}
    </Switch>
  )
);

export default () => (
  <section className="wgsa-page wgsa-compact-page wgsa-upload-instuctions">
    <h1>Drag and drop files to begin.</h1>
    <div>
      <h2>Genomic Data</h2>
      <p>
        One or more <strong>assemblies</strong> in <a href="https://en.wikipedia.org/wiki/FASTA_format" target="_blank" rel="noopener">multi-FASTA format</a> with one of the following extensions:
      </p>
      <ul className="inline">
        {DEFAULT.GENOME_FILE_EXTENSIONS.map(ext => <li key={ext}>{ext}</li>)}
      </ul>
      <p>Please ensure that there is <strong>one file per genome</strong>.</p>
      <h2>Settings</h2>
      <p>
        <SettingsSwitch setting="compression">
          <strong>Enable Compression</strong>
        </SettingsSwitch>
        <small>Recommended for slow connections.</small>
      </p>
      <p>
        <SettingsSwitch setting="individual">
          <strong>Upload Files Individually</strong>
        </SettingsSwitch>
        <small>Recommended for unstable connections.</small>
      </p>
    </div>
    <div>
      <h2>Metadata</h2>
      <p>Files in <a href="https://en.wikipedia.org/wiki/Comma-separated_values" target="_blank" rel="noopener">CSV format</a> with the extension <strong>.csv</strong>.</p>
      <p>Files should contain a column <strong>filename</strong> containing the names of genome files uploaded at the same time.</p>
      <p>To make full use of metadata, we strongly recommend including the following columns:</p>
      <ul className="inline">
        <li>latitude</li>
        <li>longitude</li>
        <li>year</li>
        <li>month</li>
        <li>day</li>
      </ul>
      <p>When providing a date, month and day are optional. Additional metadata may be included and will be saved.</p>
      <h3>CSV Templates</h3>
      <ul>
        <li>
          <a href="/wgsa-general-metadata-template.csv" download="wgsa-general-metadata-template.csv">
            General
          </a>
        </li>
        <li>
          <a href="/wgsa-typhi-metadata-template.csv" download="wgsa-typhi-metadata-template.csv">
            <FormattedName organismId="90370" fullName />
          </a>
        </li>
      </ul>
    </div>
  </section>
);
