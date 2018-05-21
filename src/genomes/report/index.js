import './styles.css';

import { connect } from 'react-redux';

import Report from './Report.react';

import { closeReport, updateClusteringProgress } from './actions';

function mapStateToProps({ genomes }) {
  return genomes.report;
}

function mapDispatchToProps(dispatch) {
  return {
    updateClusteringProgress: (payload) => dispatch(updateClusteringProgress(payload)),
    close: () => dispatch(closeReport(null)),
  };
}

export { showGenomeReport } from './actions';

export default connect(mapStateToProps, mapDispatchToProps)(Report);
