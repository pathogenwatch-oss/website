import './styles.css';

import { connect } from 'react-redux';

import GenomeDrawer from './GenomeDrawer.react';

import { closeDrawer } from './actions';

function mapStateToProps({ genomeDrawer }) {
  return genomeDrawer;
}

function mapDispatchToProps(dispatch) {
  return {
    close: () => dispatch(closeDrawer(null)),
  };
}

export reducer from './reducer';

export default connect(mapStateToProps, mapDispatchToProps)(GenomeDrawer);
