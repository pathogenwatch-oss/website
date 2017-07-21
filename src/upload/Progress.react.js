import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import * as upload from './selectors';

const Progress = ({ summary }) => (
  <ul className="wgsa-content-margin">
    {summary.map(organism =>
      <li key={organism.organismId}>
        <div className="mdl-chip mdl-chip--contact">
          <div className="mdl-chip__contact">{organism.total}</div>
          <div className="mdl-chip__text">{organism.organismName}</div>
        </div>
          <ul style={{ marginLeft: 24 }}>
            {organism.sequenceTypes.map(({ st, total }) =>
              <li key={st}>
                <div className="mdl-chip mdl-chip--contact mdl-chip--active">
                  <div className="mdl-chip__contact">{total}</div>
                  <div className="mdl-chip__text">ST{st}</div>
                </div>
              </li>
            )}
          </ul>
      </li>
    )}
  </ul>
);

function mapStateToProps(state) {
  return {
    summary: upload.getAnalysisSummary(state),
  };
}

export default connect(mapStateToProps)(Progress);
