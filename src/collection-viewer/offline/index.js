import './styles.css';

import { connect } from 'react-redux';

import SaveForOffline from './SaveForOffline.react';

import { getStatus } from './selectors';

import { checkStatus, saveForOffline } from './actions';

function mapStateToProps(state) {
  return {
    status: getStatus(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkStatus: () => dispatch(checkStatus()),
    onSave: () => dispatch(saveForOffline()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveForOffline);
