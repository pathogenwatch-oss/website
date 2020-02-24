import React from 'react';
import { showGenomeReport } from '../../genome-report';
import { connect } from 'react-redux';

const GenomeReportButton = ({ id, name, text, dispatch }) => (
  <button
    className="pw-report-button"
    title="Details"
    onClick={() => dispatch(showGenomeReport(id, name))}
  >{text}</button>
);

export default connect(
  null,
  null
)(GenomeReportButton);
