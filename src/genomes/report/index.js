import './styles/index.css';

import { connect } from 'react-redux';

import Report from './Report.react';

import { closeReport } from './actions';

function mapStateToProps({ genomes }) {
  return genomes.report;
}

function mapDispatchToProps(dispatch) {
  return {
    close: () => dispatch(closeReport(null)),
  };
}

export { showGenomeReport } from './actions';

export default connect(mapStateToProps, mapDispatchToProps)(Report);
