import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import * as upload from './selectors';

const Recovery = ({ files }) => (
  <div className="wgsa-content-margin">{JSON.stringify(files)}</div>
);

function mapStateToProps(state) {
  return {
    files: upload.getFileSummary(state),
  };
}

export default connect(mapStateToProps)(Recovery);
