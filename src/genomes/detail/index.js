import './styles.css';

import { connect } from 'react-redux';

import Detail from './Detail.react';

import { closeDrawer } from './actions';

function mapStateToProps({ genomes }) {
  return genomes.detail;
}

function mapDispatchToProps(dispatch) {
  return {
    close: () => dispatch(closeDrawer(null)),
  };
}

export { showGenomeDrawer } from './actions';

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
