import React from 'react';
import { showGenomeReport } from '../../genome-report';
import { connect } from 'react-redux';

const GenomeReportButton = ({ id, name, text, collectionId, dispatch }) => (
  <button
    className="pw-report-button"
    title="Details"
    onClick={() => dispatch(showGenomeReport(id, name, collectionId))}
  >{text}</button>
);

export default connect(
  (state) => ({
    collectionId: state.viewer.entities.collection.token,
  }),
  null
)(GenomeReportButton);
