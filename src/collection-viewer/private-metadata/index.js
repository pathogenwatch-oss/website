import './styles.css';

import { connect } from 'react-redux';

import PrivateMetadata from './PrivateMetadata.react';

import { addPrivateMetadata, clearPrivateMetadata } from './actions';
import { numberOfMetadataRows } from './selectors';

function mapStateToProps(state) {
  return {
    numberOfRows: numberOfMetadataRows(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addMetadata: data => dispatch(addPrivateMetadata(data)),
    clearMetadata: () => dispatch(clearPrivateMetadata()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateMetadata);
